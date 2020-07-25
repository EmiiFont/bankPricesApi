'use strict';

const path = require('path');
const admin = require('firebase-admin');

const serviceAccount = process.env.NODE_ENV == "development" ? require('../google-credentials-test.json') : require('../google-credentials.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = process.env.NODE_ENV == "development" ? admin.storage().bucket('gs://bankpricestore-test.appspot.com') : admin.storage().bucket('gs://bankpricesstore.appspot.com');

const config = {
    action: 'read',
    expires: '01-01-2500',
  };

const addPrice = (bankPrice) => {
    db.collection(bankPrice.name).doc(bankPrice.date).set(bankPrice).then((vl)=>{
      console.log(vl);
    });
}


const addBankPrices = async(bankPricesArr) => {
    for(let bank of bankPricesArr){

        if(bank == undefined) continue;
        
        let docRef = db.collection('banks').doc(bank.name);
        let docData = await docRef.get();
        let document = docData.data();
        
        let now = new Date();
        let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        if(document != undefined){
            let lastPriceDoc;
             await docRef.collection('prices').where('date', '>=', yesterday.toISOString()).limit(1).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let d = doc.data();
                    lastPriceDoc = d;
                    console.log(d);
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

            if(lastPriceDoc != undefined) {
                if(lastPriceDoc.dollarBuy != undefined){
                    bank.USBuyChange = getTypeOfChange(bank, lastPriceDoc, 'dollarBuy');
                }
                if(lastPriceDoc.dollarSell != undefined){
                    bank.USSellChange = getTypeOfChange(bank, lastPriceDoc, 'dollarSell');
                }
                if(lastPriceDoc.euroBuy != undefined){
                    bank.EUBuyChange = getTypeOfChange(bank, lastPriceDoc, 'euroBuy');
                }
                if(lastPriceDoc.euroSell != undefined){
                    bank.EUSellChange = getTypeOfChange(bank, lastPriceDoc, 'euroSell');
                }
            }; 
        }
        
        bank.date = new Date();
        
        docRef.collection('prices').doc(JSON.parse(JSON.stringify(bank.date))).set(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
            console.log(writeResult);
        });
        
        if(document != undefined){
            docRef.update(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
                console.log(writeResult);
            });
        }else{
            docRef.set(JSON.parse(JSON.stringify(bank)), { merge: true }).then(writeResult =>{
                console.log("added bank to the store " + bank.name);
            })
        }
    }
}


const getAveragePrice = (bankPricesArr) => {
//     class BankPrice {
//         constructor(name, dollarBuy, dollarSell, euroBuy, euroSell, currency, error) {
//           this.name = name;
//           this.dollarBuy = dollarBuy;
//           this.dollarSell = dollarSell;
//           this.euroBuy = euroBuy;
//           this.euroSell = euroSell;
//           this.error = error;
//           this.currency = currency;
//           this.date = new Date();
//         }
//       };
    
// class CurrencyInfo{
//     constructor(symbol, buy, sell){
//       this.symbol = symbol;
//       this.buy = buy;
//       this.sell = sell;
//     }
//   }
let dollarBuySum = 0;
let dollarSellAvg = 0;
for(let bank of bankPricesArr){
    if(bank.dollarBuy > 0)
      dollarBuyAvg += bank.dollarBuy;

}
 return dollarBuySum / bankPricesArr.length;

}

const getTypeOfChange = (newObj, oldObj, property) =>{
    return newObj[property] > oldObj[property] ? 'Increase' : newObj[property] == oldObj[property] ? 'Equal' : 'Decrease';
}

const addBank = async (bank) => {
        db.collection('banks').doc(bank.name).set(JSON.parse(JSON.stringify(bank)), { merge: true }).then(writeResult =>{
            console.log("added bank " + bank.name);
        })
}

const uploadFile = async (filePath, bank) => {
    let file = await bucket.upload(filePath);
    let url = file.getSignedUrl(config);
    
    return url;
}



///retrieve download url of the images in the bucket
const retrievePublicUrl = async () => {
    let files = await bucket.getFiles();
    let images = await Promise.all(files[0].map( async (file) =>{
               let url = await file.getSignedUrl(config);
               return {name: path.basename(file.name, path.extname(file.name)), url: url[0]};
             }));
       
    return images;
}

module.exports.addBankPrices = addBankPrices;
module.exports.addPrice = addPrice;
module.exports.retrievePublicUrl = retrievePublicUrl;
module.exports.addBank = addBank;
module.exports.uploadFile = uploadFile;