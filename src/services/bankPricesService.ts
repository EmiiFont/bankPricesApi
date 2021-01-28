"use strict";

import { IBankPrice } from "../models/bankprice";

import * as path from "path";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { ICurrencyInfo } from "../models/currencyInfo";
import QuerySnapshot = admin.firestore.QuerySnapshot;
import DocumentData = admin.firestore.DocumentData;

const params: ServiceAccount = {
  projectId: process.env.project_id,
  privateKey: process.env.private_key?.replace(/\\n/g, "\n"),
  clientEmail: process.env.client_email,
};

console.log(params);
admin.initializeApp({
  credential: admin.credential.cert(params),
});

const db = admin.firestore();
const bucket = admin.storage().bucket("gs://bankpricestore-test.appspot.com");

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
    let lastPriceDoc: DocumentData = {};

    if (document !== undefined) {
      const lastPriceDocQuery: QuerySnapshot = await docRef
        .collection("prices")
        .where("date", ">=", yesterday.toISOString())
        .limit(1)
        .get();

      lastPriceDoc = lastPriceDocQuery.docs[0].data();

      if (lastPriceDoc) {
        const currencies: Array<ICurrencyInfo> = lastPriceDoc.currency;
        currencies.forEach((oldCurrencyPrice) => {
          const newCurrencyPrice = bank.currency?.find((v) => v.symbol.includes(oldCurrencyPrice.symbol));
          if (newCurrencyPrice) {
            newCurrencyPrice.buyChange = getTypeOfChange(newCurrencyPrice, oldCurrencyPrice, true);
            newCurrencyPrice.sellChange = getTypeOfChange(newCurrencyPrice, oldCurrencyPrice, false);
          }
        });
      }
    }

    bank.date = new Date();
    await docRef
      .collection("prices")
      .doc(JSON.parse(JSON.stringify(bank.date.toLocaleDateString())))
      .set(JSON.parse(JSON.stringify(bank)));

    if (document !== undefined) {
      await docRef.update(JSON.parse(JSON.stringify(bank)));
    } else {
      const result = await docRef.set(JSON.parse(JSON.stringify(bank)), { merge: true });
      if (result.writeTime) {
        console.log("added bank to the store " + bank?.name);
      }
    }
  }
};

/**
 * Gets the weekly difference of the average price (buys and sells) from a currency
 *
 */
export async function getWeeklyDifference(bankPricesArr: IBankPrice[]) {
  let buyAvg = 0;
  let sellAvg = 0;
  let buyLength = 0;
  let sellLength = 0;
  const symbol = "USD";

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

const getTypeOfChange = (currentCurrency: ICurrencyInfo, oldObj: ICurrencyInfo, isBuy: boolean) => {
  if (currentCurrency) {
    if (isBuy) {
      if (currentCurrency.buy > oldObj.buy) return "increase";
      if (currentCurrency.buy == oldObj.buy) return "equal";
    } else {
      if (currentCurrency.sell > oldObj.sell) return "increase";
      if (currentCurrency.sell == oldObj.sell) return "equal";
    }
  }
  return "decrease";
};

export const addBank = async (bank) => {
  await db
    .collection("banks")
    .doc(bank.name)
    .set(JSON.parse(JSON.stringify(bank)), { merge: true });
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
