'use strict';

const admin = require('firebase-admin');
const serviceAccount = require('../bankpricesstore-firebase-cred.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const addPrice = (bankPrice) => {
    db.collection(bankPrice.name).doc(bankPrice.date).set(bankPrice).then((vl)=>{
      console.log(vl);
    });
}

const addBankPrices = (bankPricesArr) => {
    for(let bank of bankPricesArr){
        db.collection(bank.name).add(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
            console.log(writeResult);
          });
    }
}

module.exports.addBankPrices = addBankPrices;
module.exports.addPrice = addPrice;