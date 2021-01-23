import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';
import { parseDecimalFromArrayOfString } from '../utils/utils';

export class BanescoScrapper extends ScrapperBaseHandler<BanescoScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Banesco;

    await page.goto('https://www.banesco.com.do/', this.puppeteerPageConfig);

    const pricesElement = await page.$(
      '.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)',
    );

    const textBuy = await page.evaluate((element) => element.textContent, pricesElement);

    let splittedText = textBuy.split('RD$');
    let currencyInfo = parseDecimalFromArrayOfString(splittedText);

    const curr = [
      { symbol: CurrencySymbol.US, buy: currencyInfo[0], sell: currencyInfo[1] },
      { symbol: CurrencySymbol.EU, buy: currencyInfo[2], sell: currencyInfo[3] },
    ];

    return await this.getPricesFromArray(curr);
  }
}
