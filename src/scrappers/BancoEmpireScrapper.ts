import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";
import { getTextContentForPrices } from "../utils/utils";

export class BancoEmpireScrapper extends ScrapperBaseHandler<BancoEmpireScrapper> {
  bankName = Banks.BancoEmpire;

  async scrapeData(page: Page): Promise<IBankPrice> {
    await page.goto("https://www.bancoempire.com.do", this.puppeteerPageConfig);

    const frames = await page.frames();

    const dollarBuyPrice = await this.getEmpireFrameContent(page, frames, "https://www.bancoempire.com.do/txt/dollarcompra.txt");
    const dollarSellPrice = await this.getEmpireFrameContent(page, frames, "https://www.bancoempire.com.do/txt/dollarventa.txt");
    const euroBuyPrice = await this.getEmpireFrameContent(page, frames, "https://www.bancoempire.com.do/txt/eurocompra.txt");
    const euroSellPrice = await this.getEmpireFrameContent(page, frames, "https://www.bancoempire.com.do/txt/euroventa.txt");

    const curr = [
      { symbol: CurrencySymbol.US, buy: dollarBuyPrice, sell: dollarSellPrice },
      { symbol: CurrencySymbol.EU, buy: euroBuyPrice, sell: euroSellPrice },
    ];

    return await this.getPricesFromArray(curr);
  }

  async getEmpireFrameContent(page, pageFrames, url) {
    const contenFrame = pageFrames.find((f) => f.url() === url);
    const contentElement = await contenFrame.$("body > pre");
    return getTextContentForPrices(page, contentElement);
  }
}
