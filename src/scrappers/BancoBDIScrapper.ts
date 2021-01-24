import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { IBankPrice } from "../models/bankprice";
import { Page } from "puppeteer";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class BancoBDIScrapper extends ScrapperBaseHandler<BancoBDIScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Bdi;
    this.usBuyElement = ".container > .row > .col-sm-6 > .flright > li:nth-child(4)";
    this.usSellElement = ".container > .row > .col-sm-6 > .flright > .mc_xs_item";
    this.euBuyElement = ".container > .row > .separator > .mc_list > li:nth-child(4)";
    this.euSellElement = ".container > .row > .separator > .mc_list > .mc_xs_item";

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

    await page.goto("https://www.bdi.com.do/", this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
