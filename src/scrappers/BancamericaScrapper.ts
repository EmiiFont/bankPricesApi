import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class BancamericaScrapper extends ScrapperBaseHandler<BancamericaScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Bancamerica;
    this.usBuyElement = ".contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(4)";
    this.usSellElement = ".contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(8)";
    this.euBuyElement = ".contenedor > .cuadro > .list-inline > li:nth-child(2) > strong:nth-child(4)";
    this.euSellElement = ".contenedor > .cuadro > .list-inline > li:nth-child(2) > strong:nth-child(8)";

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

    await page.goto("https://www.bancamerica.com.do", this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
