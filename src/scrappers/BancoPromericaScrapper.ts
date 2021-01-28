import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class BancoPromericaScrapper extends ScrapperBaseHandler<BancoPromericaScrapper> {
  bankName = Banks.Promerica;
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = ".container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(1)";
    this.usSellElement = ".container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(3)";
    this.euBuyElement = "#hcompra";
    this.euSellElement = "#hventa";

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

    await page.goto("https://www.promerica.com.do/", this.puppeteerPageConfig);

    // await page.click('.row > #tipoCambioHome > .col-sm-6 > nav > .tipoEuro');

    return await this.getPrices();
  }
}
