import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol, ICurrencyInfo } from "../models/currencyInfo";
import { parseDecimalFromArrayOfString } from "../utils/utils";

export class BancoLopezDeHaroScrapper extends ScrapperBaseHandler<BancoLopezDeHaroScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.LopezDeHaro;
    this.usBuyElement = ".instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p";

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

    await page.goto("https://www.blh.com.do/", this.puppeteerPageConfig);

    const text = await page.evaluate((element) => element.textContent, this.usBuyElement);

    const strArr = text
      .replace(new RegExp("———", "g"), " ")
      .replace(new RegExp("—-", "g"), " ")
      .replace(new RegExp("———", "g"), " ")
      .split(" ");

    const pricesArr = parseDecimalFromArrayOfString(strArr);
    const currencyInfo: ICurrencyInfo[] = [
      {
        symbol: CurrencySymbol.US,
        buy: pricesArr[0],
        sell: pricesArr[1],
      },
      {
        symbol: CurrencySymbol.EU,
        buy: pricesArr[2],
        sell: pricesArr[3],
      },
    ];

    return await this.getPricesFromArray(currencyInfo);
  }
}
