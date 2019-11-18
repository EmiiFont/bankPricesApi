'use strict';

const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('../bankpricesstore-firebase-cred.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = admin.storage().bucket('gs://bankpricesstore.appspot.com');

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
        
        let docRef = db.collection('banks').doc(bank.name);
        let docData = await docRef.get();
        let document = docData.data();
        
        if(document.dollarBuy != undefined){
           bank.increasedDollarBuy = bank.dollarBuy > document.dollarBuy;
           bank.decreasedDollarBuy = bank.dollarBuy < document.dollarBuy;
        }
        if(document.dollarSell != undefined){
            bank.increasedDollarSell = bank.dollarSell > document.dollarSell;
            bank.decreasedDollarSell = bank.dollarSell < document.dollarSell;
        }
        if(document.euroBuy != undefined){
            bank.increasedEuroBuy = bank.euroBuy > document.euroBuy;
            bank.decreasedEuroBuy = bank.euroBuy < document.euroBuy;
        }
        if(document.euroSell != undefined){
            bank.increasedEuroSell = bank.euroSell > document.euroSell;
            bank.decreasedEuroSell = bank.euroSell < document.euroSell;
        }
        docRef.collection('prices').doc(JSON.parse(JSON.stringify(bank.date))).set(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
            console.log(writeResult);
        });
        docRef.update(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
            console.log(writeResult);
        });
    }
}

const addBank = async (bank) => {
        db.collection('banks').doc(bank.name).update(JSON.parse(JSON.stringify(bank))).then(writeResult =>{
            console.log("added bank " + bank);
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