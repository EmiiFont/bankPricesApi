"use strict";

import { IBankPrice } from "../models/bankprice";

import * as path from "path";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import * as serviceAccount from "../../google-credentials-test.json";
import DocumentData = admin.firestore.DocumentData;

// const serviceAccount =
//   process.env.NODE_ENV == 'development'
//     ? await import('../../google-credentials-test.json')
//     : await import('../../google-credentials.json');
const params: ServiceAccount = {
  projectId: serviceAccount.project_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
};

admin.initializeApp({
  credential: admin.credential.cert(params),
});

const db = admin.firestore();
const bucket =
  process.env.NODE_ENV === "development"
    ? admin.storage().bucket("gs://bankpricestore-test.appspot.com")
    : admin.storage().bucket("gs://bankpricesstore.appspot.com");

export const addPrice = (bankPrice: IBankPrice) => {
  db.collection(bankPrice.name)
    .doc(bankPrice.date != undefined ? bankPrice.date.toDateString() : "")
    .set(bankPrice)
    .then((vl) => {
      console.log(vl);
    });
};

export const addBankPrices = async (bankPricesArr: Array<IBankPrice | null>) => {
  for (const bank of bankPricesArr) {
    if (bank === undefined || bank === null || bank.error) continue;

    const docRef = db.collection("banks").doc(bank.name);
    const docData = await docRef.get();
    const document = docData.data();

    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    if (document !== undefined) {
      let lastPriceDoc: any = null;
      await docRef
        .collection("prices")
        .where("date", ">=", yesterday.toISOString())
        .limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const d = doc.data();
            lastPriceDoc = d;
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });

      if (lastPriceDoc !== undefined) {
        if (lastPriceDoc.dollarBuy !== undefined) {
          bank.USBuyChange = getTypeOfChange(bank, lastPriceDoc, "dollarBuy");
        }
        if (lastPriceDoc.dollarSell !== undefined) {
          bank.USSellChange = getTypeOfChange(bank, lastPriceDoc, "dollarSell");
        }
        if (lastPriceDoc.euroBuy !== undefined) {
          bank.EUBuyChange = getTypeOfChange(bank, lastPriceDoc, "euroBuy");
        }
        if (lastPriceDoc.euroSell !== undefined) {
          bank.EUSellChange = getTypeOfChange(bank, lastPriceDoc, "euroSell");
        }
      }
    }

    bank.date = new Date();

    docRef
      .collection("prices")
      .doc(JSON.parse(JSON.stringify(bank.date)))
      .set(JSON.parse(JSON.stringify(bank)))
      .then((writeResult) => {
        console.log(writeResult);
      });

    if (document !== undefined) {
      docRef.update(JSON.parse(JSON.stringify(bank))).then((writeResult) => {
        console.log(writeResult);
      });
    } else {
      docRef.set(JSON.parse(JSON.stringify(bank)), { merge: true }).then((writeResult) => {
        console.log("added bank to the store " + bank?.name);
      });
    }
  }
};

/**
 * Gets the weekly difference of the average price (buys and sells) from a currency
 *
 */
async function getWeeklyDifference(bankPricesArr: IBankPrice[]) {
  let buyAvg = 0;
  let sellAvg = 0;
  let buyLength = 0;
  let sellLength = 0;
  const symbol = "US";

  for (const bank of bankPricesArr) {
    if (bank === undefined) continue;

    const avgCurrency = bank?.currency?.find((d) => d.symbol == symbol);

    if (avgCurrency != undefined) {
      if (avgCurrency.buy > 0) {
        buyAvg += avgCurrency.buy;
        buyLength++;
      }
      if (avgCurrency.sell > 0) {
        sellAvg += avgCurrency.sell;
        sellLength++;
      }
    }
  }

  const docRef = db.collection("notifications").doc("weekly");
  const docData = await docRef.get();
  const document = docData.data();

  const buyAvgToday = buyAvg / buyLength;
  const sellAvgToday = sellAvg / sellLength;

  const avgPrices = [{ buyAvg: buyAvgToday, sellAvg: sellAvgToday, symbol: symbol }];

  if (document == undefined || document.createdDate == undefined) {
    await docRef.set({
      avgPrices: avgPrices,
      createdDate: new Date(),
    });
  } else {
    const diffTime = Math.abs(document.createdDate.toDate() - new Date().getDate());

    // a week has passed
    if (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) >= 1) {
      const currencyAvg = document.avgPrices.find((c) => c.symbol == symbol);

      const buyDifference = buyAvgToday - currencyAvg.buyAvg;
      const sellDifference = sellAvgToday - currencyAvg.sellAvg;

      await docRef.set({
        avgPrices: avgPrices,
        createdDate: new Date(),
      });

      return { buyDifference: buyDifference, sellDifference: sellDifference, currency: symbol };
    }
  }
  return {};
  // let newVar = {buyDifference: null, sellDifference: null};
  //  return newVar;
}

const getTypeOfChange = (newObj: IBankPrice, oldObj: DocumentData, property: string) => {
  return newObj[property] > oldObj[property] ? "Increase" : newObj[property] == oldObj[property] ? "Equal" : "Decrease";
};

export const addBank = async (bank) => {
  db.collection("banks")
    .doc(bank.name)
    .set(JSON.parse(JSON.stringify(bank)), { merge: true })
    .then((writeResult) => {
      console.log("added bank " + bank.name);
    });
};

export const uploadFile = async (filePath) => {
  const file = await bucket.upload(filePath);
  return file[0].getSignedUrl({ action: "read", expires: "01-01-2500" });
};

// /retrieve download url of the images in the bucket
export const retrievePublicUrl = async () => {
  const files = await bucket.getFiles();
  return await Promise.all(
    files[0].map(async (file) => {
      const url = await file.getSignedUrl({ action: "read", expires: "01-01-2500" });
      return { name: path.basename(file.name, path.extname(file.name)), url: url[0] };
    }),
  );
};

module.exports.addBankPrices = addBankPrices;
module.exports.addPrice = addPrice;
module.exports.retrievePublicUrl = retrievePublicUrl;
module.exports.addBank = addBank;
module.exports.uploadFile = uploadFile;
module.exports.getWeeklyDifference = getWeeklyDifference;
