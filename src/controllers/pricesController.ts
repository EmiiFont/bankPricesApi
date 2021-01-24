'use strict';

import * as puppeteer from 'puppeteer';
import { ScrapperFacade } from '../scrappers/ScrapperFacade';
import { addBank, addBankPrices, retrievePublicUrl } from '../services/bankPricesService';
import { bankNames } from '../utils/bankNames';

// const scraper = require('../utils/scraper');
// const notificationService = require('../services/notificationService');
// const bankNames = require('../utils/bankNames');

export async function listPrices(req, res) {
  const browser = await puppeteer.launch();

  const facade = new ScrapperFacade();
  const bankPrices = await facade.execute(browser);

  try {
    let logoUrls = await retrievePublicUrl();

    bankNames.forEach((bank) => {
      let url = logoUrls.find((c) => c.name == bank.name);
      if (url != undefined) {
        bank.imageUrl = url.url;
      }
      addBank(bank);
    });

    await addBankPrices(bankPrices);
    //let weekly = await getWeeklyDifference(bankPrices);
    //notificationService.sendWeeklyNotifcation(weekly);
    res.send(bankPrices);
  } catch (e) {
    res.status(500).send(e);
  }
}
