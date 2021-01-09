'use strict';

import {IBankPrice} from "../models/bankprice";

const path = require('path');
import * as admin from 'firebase-admin';
import DocumentData = admin.firestore.DocumentData;

const serviceAccount = process.env.NODE_ENV == "development" ? require('../google-credentials-test.json') : require('../google-credentials.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const bucket = process.env.NODE_ENV === "development" ? admin.storage().bucket('gs://bankpricestore-test.appspot.com') : admin.storage().bucket('gs://bankpricesstore.appspot.com');

const config = {
    action: 'read',
    expires: '01-01-2500',
  };

const addPrice = (bankPrice: IBankPrice) => {
    db.collection(bankPrice.name).doc(bankPrice.date.toDateString()).set(bankPrice).then((vl)=>{
      console.log(vl);
    });
}


const addBankPrices = async(bankPricesArr: IBankPrice[]) => {
    for(let bank of bankPricesArr){

        if(bank === undefined || bank.error) continue;
        
        let docRef = db.collection('banks').doc(bank.name);
        let docData = await docRef.get();
        let document = docData.data();
        
        let now = new Date();
        let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        if(document !== undefined){
            let lastPriceDoc: DocumentData;
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

            if(lastPriceDoc !== undefined) {
                if(lastPriceDoc.dollarBuy !== undefined){
                    bank.USBuyChange = getTypeOfChange(bank, lastPriceDoc, 'dollarBuy');
                }
                if(lastPriceDoc.dollarSell !== undefined){
                    bank.USSellChange = getTypeOfChange(bank, lastPriceDoc, 'dollarSell');
                }
                if(lastPriceDoc.euroBuy !== undefined){
                    bank.EUBuyChange = getTypeOfChange(bank, lastPriceDoc, 'euroBuy');
                }
                if(lastPriceDoc.euroSell !== undefined){
                    bank.EUSellChange = getTypeOfChange(bank, lastPriceDoc, 'euroSell');
                }
            }; 
        }
        
        bank.date = new Date();
        
        docRef.collection('prices').doc(JSON.parse(JSON.stringify(bank.date))).set(JSON.parse(JSON.stringify(bank))).then((writeResult)=>{
            console.log(writeResult);
        });
        
        if(document !== undefined){
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

/** 
 * Gets the weekly difference of the average price (buys and sells) from a currency
 * 
*/
const getWeeklyDifference = async (bankPricesArr: IBankPrice[]) => {

let buyAvg = 0;
let sellAvg = 0;
let buyLength = 0;
let sellLength = 0;
const symbol = 'US';

for(let bank of bankPricesArr){
    if(bank === undefined) continue;

    let avgCurrency = bank.currency.find(d => d.symbol == symbol);
    
    if(avgCurrency != undefined){
        if(avgCurrency.buy > 0){
            buyAvg += avgCurrency.buy;
            buyLength++;
        }
        if(avgCurrency.sell > 0){
            sellAvg += avgCurrency.sell;
            sellLength++;
        }
    }
}

let docRef = db.collection('notifications').doc('weekly');
let docData = await docRef.get();
let document = docData.data();

let buyAvgToday = buyAvg / buyLength;
let sellAvgToday = sellAvg / sellLength;

let avgPrices = [{buyAvg: buyAvgToday, sellAvg: sellAvgToday, symbol: symbol ,}]

if(document == undefined || document.createdDate == undefined){
    await docRef.set({
        avgPrices: avgPrices,
        createdDate: new Date()
    });
}
else {
    const diffTime = Math.abs(document.createdDate.toDate() - new Date().getDate());
   
    //a week has passed
    if(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) >= 1) {

        let currencyAvg = document.avgPrices.find(c => c.symbol == symbol);

        let buyDifference =  buyAvgToday - currencyAvg.buyAvg;
        let sellDifference = sellAvgToday - currencyAvg.sellAvg;
        
        await docRef.set({
            avgPrices: avgPrices,
            createdDate: new Date()
        });

        return { buyDifference: buyDifference, sellDifference: sellDifference, currency: symbol};
    }
}

   // let newVar = {buyDifference: null, sellDifference: null};
  //  return newVar;
}

const getTypeOfChange = (newObj: IBankPrice, oldObj: DocumentData, property: string) =>{
    return newObj[property] > oldObj[property] ? 'Increase' : newObj[property] == oldObj[property] ? 'Equal' : 'Decrease';
}

const addBank = async (bank) => {
        db.collection('banks').doc(bank.name).set(JSON.parse(JSON.stringify(bank)), { merge: true }).then(writeResult =>{
            console.log("added bank " + bank.name);
        })
}

const uploadFile = async (filePath, bank) => {
    let file = await bucket.upload(filePath);
    let url = file[0].getSignedUrl({action: "read", expires: "01-01-2500"});
    
    return url;
}



///retrieve download url of the images in the bucket
const retrievePublicUrl = async () => {
    let files = await bucket.getFiles();
    let images = await Promise.all(files[0].map( async (file) =>{
               let url = await file.getSignedUrl({action: "read", expires: "01-01-2500"});
               return {name: path.basename(file.name, path.extname(file.name)), url: url[0]};
             }));
       
    return images;
}

module.exports.addBankPrices = addBankPrices;
module.exports.addPrice = addPrice;
module.exports.retrievePublicUrl = retrievePublicUrl;
module.exports.addBank = addBank;
module.exports.uploadFile = uploadFile;
module.exports.getWeeklyDifference = getWeeklyDifference;