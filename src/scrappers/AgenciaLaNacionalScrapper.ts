import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';

// @ts-ignore
export class AgenciaLaNacionalScrapper extends ScrapperBaseHandler<AgenciaLaNacionalScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Acn;
    this.usBuyElement = '.premium:nth-child(2) > .plan-features > ul > li:nth-child(1) > h4';
    this.euBuyElement = '.premium:nth-child(3) > .plan-features > ul > li:nth-child(1) > h4';
    this.gbpBuyElement = '.premium:nth-child(3) > .plan-features > ul > li:nth-child(1) > h4';
    this.chfBuyElement = '.featured:nth-child(4) > .plan-features > ul > li:nth-child(1) > h4';
    this.cadBuyElement = '.featured:nth-child(2) > .plan-features > ul > li:nth-child(1) > h4';

    this.currenciesElements = [
      {
        symbol: CurrencySymbol.US,
        buyElement: this.usBuyElement,
      },
      {
        symbol: CurrencySymbol.EU,
        buyElement: this.euBuyElement,
      },
      {
        symbol: CurrencySymbol.CAD,
        buyElement: this.cadBuyElement,
      },
      {
        symbol: CurrencySymbol.CHF,
        buyElement: this.chfBuyElement,
      },
      {
        symbol: CurrencySymbol.GBP,
        buyElement: this.gbpBuyElement,
      },
    ];

    await page.goto('https://acn.com.do/', this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
