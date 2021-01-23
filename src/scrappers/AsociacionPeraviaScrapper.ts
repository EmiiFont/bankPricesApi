import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';

class AsociacionPeraviaScrapper extends ScrapperBaseHandler<AsociacionPeraviaScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.BancoPeravia;
    this.usBuyElement = '.row > .col-sm-8 > .tasas > .compra:nth-child(2) > strong';
    this.usSellElement = '.row > .col-sm-8 > .tasas > .compra:nth-child(3) > strong';

    this.currenciesElements = [
      {
        symbol: CurrencySymbol.US,
        buyElement: this.usBuyElement,
        sellElement: this.usSellElement,
      },
    ];

    await page.goto('https://asociacionperavia.com.do/', this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
