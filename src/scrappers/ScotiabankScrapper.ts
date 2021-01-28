import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class ScotiabankScrapper extends ScrapperBaseHandler<ScotiabankScrapper> {
  bankName = Banks.ScotiaBank;
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = "._bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(3)";
    this.usSellElement = "._bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(4)";
    this.euBuyElement = "._bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(3)";
    this.euSellElement = "._bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(4)";

    this.currenciesElements = [
      {
        symbol: CurrencySymbol.US,
        buyElement: this.usBuyElement,
        sellElement: this.usSellElement,
      },
      {
        symbol: CurrencySymbol.EU,
        buyElement: this.euBuyElement,
        sellElement: this.euSellElement,
      },
    ];

    await page.goto("https://do.scotiabank.com/banca-personal/tarifas/tasas-de-cambio.html", this.puppeteerPageConfig);

    // let us = await this.getUSPrices();
    return await this.getPrices();
  }
}
