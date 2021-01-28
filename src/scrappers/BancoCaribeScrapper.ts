import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { IBankPrice } from "../models/bankprice";
import { Page } from "puppeteer";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";

export class BancoCaribeScrapper extends ScrapperBaseHandler<BancoCaribeScrapper> {
  bankName = Banks.BancoCaribe;
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = ".container #us_buy_res";
    this.usSellElement = ".container #us_sell_res";
    this.euBuyElement = ".container #eur_buy_res";
    this.euSellElement = ".container #eur_sell_res";

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

    await page.goto("https://www.bancocaribe.com.do/divisas", this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
