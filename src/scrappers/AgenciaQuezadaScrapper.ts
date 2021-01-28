import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";
import { parseDecimalFromArrayOfString } from "../utils/utils";

export class AgenciaQuezadaScrapper extends ScrapperBaseHandler<AgenciaQuezadaScrapper> {
  bankName = Banks.Quezada;

  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = ".blog-content-wrapper > .blog-content > ul > .da-ef > strong";
    this.euBuyElement = ".blog-content-wrapper > .blog-content > ul > .e-ef > strong";
    this.gbpBuyElement = ".blog-content-wrapper > .blog-content > ul > .le-ef > strong";
    this.chfBuyElement = ".blog-content-wrapper > .blog-content > ul > .fs-ef > strong";
    this.cadBuyElement = ".blog-content-wrapper > .blog-content > ul > .dc-ef > strong";

    await page.goto("http://agentedecambioquezada.com/divisas.html", this.puppeteerPageConfig);

    const dollar = await page.evaluate((element) => element.textContent, this.usBuyElement);
    const euro = await page.evaluate((element) => element.textContent, this.euBuyElement);
    const pound = await page.evaluate((element) => element.textContent, this.gbpBuyElement);
    const franc = await page.evaluate((element) => element.textContent, this.chfBuyElement);
    const cad = await page.evaluate((element) => element.textContent, this.cadBuyElement);

    const dollarInfo = parseDecimalFromArrayOfString(dollar.split("-"));
    const euroInfo = parseDecimalFromArrayOfString(euro.split("-"));
    const poundInfo = parseDecimalFromArrayOfString(pound.split("-"));
    const francInfo = parseDecimalFromArrayOfString(franc.split("-"));
    const cadInfo = parseDecimalFromArrayOfString(cad.split("-"));

    const curr = [
      { symbol: CurrencySymbol.US, buy: dollarInfo[0], sell: dollarInfo[1] },
      { symbol: CurrencySymbol.EU, buy: euroInfo[0], sell: euroInfo[1] },
      { symbol: CurrencySymbol.GBP, buy: poundInfo[0], sell: poundInfo[1] },
      { symbol: CurrencySymbol.CHF, buy: francInfo[0], sell: francInfo[1] },
      { symbol: CurrencySymbol.CAD, buy: cadInfo[0], sell: cadInfo[1] },
    ];

    return await this.getPricesFromArray(curr);
  }
}