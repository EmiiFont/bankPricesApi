'use strict';

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


const addBankNames = (bankNames) => {
    for(let bank of bankNames){
        db.collection('banks').doc(bank.name).set(JSON.parse(JSON.stringify(bank))).then(writeResult =>{
            console.log("added bank " + bank.name);
        })
    }
}

///retrieve download url of the images in the bucket
const retrieveBucketfiles = () =>{
    const img_url = 'https://firebasestorage.googleapis.com/v0/b/bankpricesstore.appspot.com/o/'
    bucket.getFiles().then(c => {
        c[0].forEach((value, id)=>{
           value.getMetadata().then(b => {
             console.log(img_url + b[0].name + "?alt=media&token=" + b[0].metadata.firebaseStorageDownloadTokens);
            // console.log(b[0].mediaLink + "&token=" + b[0].metadata.firebaseStorageDownloadTokens);
           });
            
        })
            
    })
}

module.exports.addBankPrices = addBankPrices;
module.exports.addPrice = addPrice;
module.exports.retrieveBucketfiles = retrieveBucketfiles;
module.exports.addBankNames = addBankNames;