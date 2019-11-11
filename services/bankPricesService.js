'use strict';

const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('../bankpricesstore-firebase-cred.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = admin.storage().bucket('gs://bankpricesstore.appspot.com');

const addPrice = (bankPrice) => {
    db.collection(bankPrice.name).doc(bankPrice.date).set(bankPrice).then((vl)=>{
      console.log(vl);
    });
}

const addBankPrices = (bankPricesArr) => {
    for(let bank of bankPricesArr){
        db.collection('banks').doc(bank.name).update(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
            console.log(writeResult);
          });
    }
}


const addBank = async (bank) => {
        db.collection('banks').doc(bank.name).set(JSON.parse(JSON.stringify(bank))).then(writeResult =>{
            console.log("added bank " + bank);
        })
}

const uploadFile = async (filePath, bank) => {
    bucket.upload(filePath).then(data => {
        let file = data[0];
         //console.log(file);
        bank.imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bankpricesstore.appspot.com/o/' 
        + file.name + "?alt=media&token=" + file.metadata.firebaseStorageDownloadTokens;

        // addBank(bank)
    });
}

///retrieve download url of the images in the bucket
const retrievePublicUrl = async () => {
    const config = {
        action: 'read',
        expires: '01-01-2500',
      };
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