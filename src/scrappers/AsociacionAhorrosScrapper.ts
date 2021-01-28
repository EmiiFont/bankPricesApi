import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";

export class AsociacionAhorrosScrapper extends ScrapperBaseHandler<AsociacionAhorrosScrapper> {
  bankName = Banks.AsociacionPopular;
  async scrapeData(page: Page): Promise<IBankPrice> {
    await page.goto("https://www.apap.com.do/calculadoras/", this.puppeteerPageConfig);

    await page.waitForSelector("#navbarNav #currency-label");

    // await page.click('#navbarNav #currency-label');

    this.usBuyElement = "#currency-buy";
    this.usSellElement = "#currency-sell";
    this.euBuyElement = this.usBuyElement;
    this.euSellElement = this.usSellElement;

    const usPrice = await this.getUSPrices();

    await page.click(".btn-group > .dropdown-menu > .list-inline > li:nth-child(2) > .dropdown-item");

    const euPrice = await this.getEUPrices();

    return await this.getPricesFromArray([usPrice, euPrice]);
  }
}
