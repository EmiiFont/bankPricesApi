import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';

// @ts-ignore
export class AsociacionNacionalScrapper extends ScrapperBaseHandler<AsociacionNacionalScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.AsociacionNacional;
    this.usBuyElement = '.block-content > table > tbody > tr > td:nth-child(3)';
    this.usSellElement = '.block-content > table > tbody > tr > td:nth-child(4)';

    this.currenciesElements = [
      {
        symbol: CurrencySymbol.US,
        buyElement: this.usBuyElement,
        sellElement: this.usSellElement,
      },
    ];

    await page.goto('https://www.alnap.com.do/', this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
