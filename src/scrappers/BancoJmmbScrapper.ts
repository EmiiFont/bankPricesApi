import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';

class BancoJmmbScrapper extends ScrapperBaseHandler<BancoJmmbScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Jmmb;
    this.usBuyElement =
      '.table-wrapper:nth-child(3) > .main-table > tbody > tr:nth-child(3) > td:nth-child(2)';
    this.usSellElement = '.table-wrapper > .main-table > tbody > tr:nth-child(3) > td:nth-child(3)';
    this.euBuyElement =
      '.table-wrapper:nth-child(3) > .main-table > tbody > tr:nth-child(4) > td:nth-child(2)';
    this.euSellElement = '.table-wrapper > .main-table > tbody > tr:nth-child(4) > td:nth-child(3)';

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

    await page.goto(
      'https://do-bank.jmmb.com/es/tasas-de-referencia#tasadecambio',
      this.puppeteerPageConfig,
    );

    return await this.getPrices();
  }
}
