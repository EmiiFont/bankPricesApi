import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class BancoBHDScrapper extends ScrapperBaseHandler<BancoBHDScrapper> {
  bankName = Banks.BHDLeon;
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = "#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(2)";
    this.usSellElement = "#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(3)";
    this.euBuyElement = "#TasasDeCambio > table > tbody > tr:nth-child(3) > td:nth-child(2)";
    this.euSellElement = "#TasasDeCambio > table > tbody > tr:nth-child(3) > td:nth-child(3)";

    this.currenciesElements = [
      {
        symbol: CurrencySymbol.US,
        buyElement: this.usBuyElement,
        sellElement: this.usSellElement,
      },
    ];

    await page.goto("https://www.bhdleon.com.do", this.puppeteerPageConfig);
    const dialogWithTasas = await page.$x("//a[contains(., 'Tasas de Cambio')]");

    await dialogWithTasas[0].click();

    return await this.getPrices();
  }
}
