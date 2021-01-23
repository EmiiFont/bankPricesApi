import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';
import { parseDecimalFromArrayOfString } from '../utils/utils';

class BancoBonanzaScrapper extends ScrapperBaseHandler<BancoBonanzaScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.Bonanza;
    this.usBuyElement = '.row > .col-md-6 > #topbar-search > .textwidget > marquee';

    await page.goto('https://www.bonanzabanco.com.do/', this.puppeteerPageConfig);

    const fullTextContents = await page.evaluate(
      (element) => element.textContent,
      this.usBuyElement,
    );

    const fullText = fullTextContents.split('  ');
    let dollarInfo = parseDecimalFromArrayOfString(fullText);

    const curr = [{ symbol: CurrencySymbol.US, buy: dollarInfo[0], sell: dollarInfo[1] }];

    return await this.getPricesFromArray(curr);
  }
}
