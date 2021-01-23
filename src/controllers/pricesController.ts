'use strict';

import { BancoPopularScrapper } from '../scrappers';
import * as puppeteer from 'puppeteer';

const scraper = require('../utils/scraper');
const bankService = require('../services/bankPricesService');
const notificationService = require('../services/notificationService');
const bankNames = require('../utils/bankNames');

exports.listPrices = async function (req, res) {
  const browser = await puppeteer.launch();
  const bankPopular = new BancoPopularScrapper();
  const popularPrice = await bankPopular.run(browser);

  console.log(popularPrice);

  let logoUrls = await bankService.retrievePublicUrl();

  bankNames.bankNames.forEach((bank) => {
    let url = logoUrls.find((c) => c.name == bank.name);
    if (url != undefined) {
      bank.imageUrl = url.url;
    }
    bankService.addBank(bank);
  });

  //scraper.initNavigation();
  const asociacionAhorros = new Promise((resolve, reject) => {
    scraper
      .initNavigation()
      .then((data) => {
        bankService.addBankPrices(data);
        bankService.getWeeklyDifference(data).then((dd) => {
          notificationService.sendWeeklyNotifcation(dd);
        });

        resolve(data);
      })
      .catch((err) => reject('asociacion failed: ' + err));
  });

  asociacionAhorros
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.status(500).send(err));
};
