import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol } from "../models/currencyInfo";
import { parseDecimalFromArrayOfString } from "../utils/utils";

export class BancoBonanzaScrapper extends ScrapperBaseHandler<BancoBonanzaScrapper> {
  bankName = Banks.Bonanza;
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.usBuyElement = ".row > .col-md-6 > #topbar-search > .textwidget > marquee";

    await page.goto("https://www.bonanzabanco.com.do/", this.puppeteerPageConfig);

    const fullTextContents = await page.evaluate((element) => element.textContent, this.usBuyElement);

    const fullText = fullTextContents.split("  ");
    const dollarInfo = parseDecimalFromArrayOfString(fullText);

    const curr = [{ symbol: CurrencySymbol.US, buy: dollarInfo[0], sell: dollarInfo[1] }];

    return await this.getPricesFromArray(curr);
  }
}
