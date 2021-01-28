"use strict";

import * as puppeteer from "puppeteer";
import { ScrapperFacade } from "../scrappers/ScrapperFacade";
import { addBank, addBankPrices, retrievePublicUrl } from "../services/bankPricesService";
import { bankNames } from "../utils/bankNames";

export async function listPrices(req, res) {
  const browser = await puppeteer.launch();

  const facade = new ScrapperFacade();
  const bankPrices = await facade.execute(browser);

  try {
    const logoUrls = await retrievePublicUrl();

    bankNames.forEach(async (bank) => {
      const url = logoUrls.find((c) => c.name == bank.name);
      if (url != undefined) {
        bank.imageUrl = url.url;
      }
      await addBank(bank);
    });
    await addBankPrices(bankPrices);
    // let weekly = await getWeeklyDifference(bankPrices);
    // notificationService.sendWeeklyNotifcation(weekly);
    res.send(bankPrices);
  } catch (e) {
    res.status(500).send(e);
  }
}
