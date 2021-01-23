import { IBankPrice } from '../models/bankprice';
import * as puppeteer from 'puppeteer';
import { DirectNavigationOptions } from 'puppeteer';
import * as sentry from '@sentry/node';
import { getTextContentForPrices, getValueForPrices } from '../utils/utils';
import { CurrencySymbol, ICurrencyInfo } from '../models/currencyInfo';
import { CurrencyElementHolder } from '../types/CurrencyElementHolder';

export abstract class ScrapperBaseHandler<T> {
  page: puppeteer.Page | undefined;
  bankName: string = 'empty';
  currenciesElements: Array<CurrencyElementHolder> = [];
  usBuyElement: string = '';
  usSellElement: string = '';
  euBuyElement: string = '';
  euSellElement: string = '';
  gbpBuyElement: string = '';
  gbpSellElement: string = '';
  cadBuyElement: string = '';
  cadSellElement: string = '';
  chfBuyElement: string = '';
  chfSellElement: string = '';

  puppeteerPageConfig: DirectNavigationOptions = { waitUntil: 'domcontentloaded', timeout: 0 };

  constructor() {}

  protected abstract scrapeData(page: puppeteer.Page): Promise<IBankPrice>;

  async run(browser: puppeteer.Browser): Promise<IBankPrice | null> {
    try {
      console.log(`now scrapping ${this.bankName}`);

      this.page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 888 });

      let iBankPrice = this.scrapeData(page);

      console.log(`finished scrapping ${this.bankName}`);

      await page.close();

      return iBankPrice;
    } catch (e) {
      sentry.captureException(e);
      console.log(e);
    }

    return null;
  }

  protected async getPriceFromSelector(selector: string | undefined): Promise<number> {
    if (selector == undefined) return 0;

    await page.waitForSelector(selector);

    let nPrice = 0;
    if (this.page !== undefined) {
      const priceElement = await this.page.$(selector);
      nPrice = await getValueForPrices(page, priceElement);
      if (nPrice === 0) {
        nPrice = await getTextContentForPrices(page, priceElement);
      }
    }
    return nPrice;
  }

  protected async getUSPrices(): Promise<ICurrencyInfo> {
    const buy = await this.getPriceFromSelector(this.usBuyElement);
    const sell = await this.getPriceFromSelector(this.usSellElement);

    return { symbol: CurrencySymbol.US, buy: buy, sell: sell };
  }

  protected async getEUPrices(): Promise<ICurrencyInfo> {
    const buy = await this.getPriceFromSelector(this.euBuyElement);
    const sell = await this.getPriceFromSelector(this.euSellElement);

    return { symbol: CurrencySymbol.EU, buy: buy, sell: sell };
  }

  protected async getCHFPrices(): Promise<ICurrencyInfo> {
    const buy = await this.getPriceFromSelector(this.chfBuyElement);
    const sell = await this.getPriceFromSelector(this.chfSellElement);

    return { symbol: CurrencySymbol.CHF, buy: buy, sell: sell };
  }

  protected async getCADPrices(): Promise<ICurrencyInfo | undefined> {
    const buy = await this.getPriceFromSelector(this.cadBuyElement);
    const sell = await this.getPriceFromSelector(this.cadSellElement);

    return { symbol: CurrencySymbol.CAD, buy: buy, sell: sell };
  }

  protected async getGBPPrices(): Promise<ICurrencyInfo | undefined> {
    const buy = await this.getPriceFromSelector(this.gbpBuyElement);
    const sell = await this.getPriceFromSelector(this.gbpSellElement);

    return { symbol: CurrencySymbol.GBP, buy: buy, sell: sell };
  }

  protected async getPrices(): Promise<IBankPrice> {
    let currencyInfoArr: Array<ICurrencyInfo> = [];

    for (const b of this.currenciesElements) {
      const buy = await this.getPriceFromSelector(b.buyElement);
      const sell = await this.getPriceFromSelector(b.sellElement);

      currencyInfoArr.push({ symbol: b.symbol, buy: buy, sell: sell });
    }

    const dollar = currencyInfoArr?.find((b) => b.symbol == 'US');
    const euro = currencyInfoArr?.find((b) => b.symbol == 'EU');

    return {
      name: this.bankName,
      dollarBuy: dollar?.buy,
      dollarSell: dollar?.sell,
      euroBuy: euro?.buy,
      euroSell: euro?.sell,
      currency: currencyInfoArr,
      error: false,
    };
  }

  protected async getPricesFromArray(currencyInfoArr: Array<ICurrencyInfo>): Promise<IBankPrice> {
    const dollar = currencyInfoArr?.find((b) => b.symbol == 'US');
    const euro = currencyInfoArr?.find((b) => b.symbol == 'EU');

    return {
      name: this.bankName,
      dollarBuy: dollar?.buy,
      dollarSell: dollar?.sell,
      euroBuy: euro?.buy,
      euroSell: euro?.sell,
      currency: currencyInfoArr,
      error: false,
    };
  }
}
