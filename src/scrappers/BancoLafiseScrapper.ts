import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class BancoLafiseScrapper extends ScrapperBaseHandler<BancoLafiseScrapper> {
  bankName = Banks.LaFise;
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = ".ng-scope > .lafise-group > .lista:nth-child(1) > .lafise-TasaCambio > .lafise-valorCompra:nth-child(4)";
    this.usSellElement = ".ng-scope > .lafise-group > .lista:nth-child(1) > .lafise-TasaCambio > .lafise-valorVenta:nth-child(5)";
    this.euBuyElement = ".ng-scope > .lafise-group > .lista:nth-child(2) > .lafise-TasaCambio > .lafise-valorCompra:nth-child(4)";
    this.euSellElement = ".ng-scope > .lafise-group > .lista:nth-child(2) > .lafise-TasaCambio > .lafise-valorVenta:nth-child(5)";

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

    await page.goto("https://www.lafise.com/blrd", this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
