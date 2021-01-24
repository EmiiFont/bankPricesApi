import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';

// @ts-ignore
export class BancoVimencaScrapper extends ScrapperBaseHandler<BancoVimencaScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Vimenca;
    this.usBuyElement =
      '.uk-clearfix:nth-child(1) > .layout-uikit > .uk-nbfc > .uk-margin > .purchaseValue';
    this.usSellElement =
      '.uk-clearfix:nth-child(1) > .layout-uikit > .uk-nbfc > .uk-margin > .saleValue';
    this.euBuyElement =
      '.uk-clearfix:nth-child(2) > .layout-uikit > .uk-nbfc > .uk-margin > .purchaseValue';
    this.euSellElement =
      '.uk-clearfix:nth-child(2) > .layout-uikit > .uk-nbfc > .uk-margin > .saleValue';

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

    await page.goto('https://www.bancovimenca.com/', this.puppeteerPageConfig);

    return await this.getPrices();
  }
}
