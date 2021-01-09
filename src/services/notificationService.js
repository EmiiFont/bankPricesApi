const admin = require('firebase-admin');
const db = admin.firestore();

const serviceAccount = process.env.NODE_ENV == "development" ? require('../google-credentials-test.json') : require('../google-credentials.json');



const sendWeeklyNotifcation = async (differenceObj) =>{

    if(differenceObj.buyDifference == undefined ||  differenceObj.sellDifference){
        return;
    }
   

    let currencyName = "dólar";
    switch(differenceObj.symbol){
        case 'US':
            currencyName = "dólar";
            break;
        case 'EU':
            currencyName = "euro";
            break;
        case 'CAD':
            currencyName = "dólar canadiense";
            break;
    }

    let message = differenceObj.buyDifference < 0 ? `La compra del ${currencyName} ha disminuido en promedio ${differenceObj.buyDifference}`  : `La compra del ${currencyName} ha aumentado en promedio  ${differenceObj.buyDifference}`;
        
    let message2 = differenceObj.sellDifference < 0 ? `La venta del ${currencyName} ha disminuido en promedio ${differenceObj.sellDifference}`  : `La venta del ${currencyName} ha aumentado en promedio  ${differenceObj.sellDifference}`;
    
    const fcmMessage = {
        notification: {
            body: message + '\n' + message2,
            title: 'Cambios esta semana'
        },
        topic: 'weekly'
    }
    
    retrieveRegisteredDevices();
    sendPushNotification(fcmMessage);
}

const retrieveRegisteredDevices = async ()  => {
   let tokens = [];
   
   let td = await db.collection("fcmTokens").get();

    td.forEach(doc => {
     tokens.push(doc.id);    
    });

   admin.messaging().subscribeToTopic(tokens, "weekly");
  
}

const sendPushNotification = (message) => {
  admin.messaging().send(message).then((response) => {
    console.log(response);
  })
  .catch((error) =>
      {
        console.log(error); 
      });
}

module.exports.sendPushNotification = sendPushNotification;
module.exports.retrieveRegisteredDevices = retrieveRegisteredDevices;
module.exports.sendWeeklyNotifcation = sendWeeklyNotifcation;