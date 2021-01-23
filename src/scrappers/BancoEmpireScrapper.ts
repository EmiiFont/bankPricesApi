import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { Page } from 'puppeteer';
import { IBankPrice } from '../models/bankprice';
import { Banks } from '../models/bankName';
import { CurrencySymbol } from '../models/currencyInfo';
import { getTextContentForPrices } from '../utils/utils';

class BancoEmpireScrapper extends ScrapperBaseHandler<BancoEmpireScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.BancoEmpire;

    await page.goto('https://www.bancoempire.com.do', this.puppeteerPageConfig);

    let frames = await page.frames();

    const dollarBuyPrice = await this.getEmpireFrameContent(
      page,
      frames,
      'https://www.bancoempire.com.do/txt/dollarcompra.txt',
    );
    const dollarSellPrice = await this.getEmpireFrameContent(
      page,
      frames,
      'https://www.bancoempire.com.do/txt/dollarventa.txt',
    );
    const euroBuyPrice = await this.getEmpireFrameContent(
      page,
      frames,
      'https://www.bancoempire.com.do/txt/eurocompra.txt',
    );
    const euroSellPrice = await this.getEmpireFrameContent(
      page,
      frames,
      'https://www.bancoempire.com.do/txt/euroventa.txt',
    );

    const curr = [
      { symbol: CurrencySymbol.US, buy: dollarBuyPrice, sell: dollarSellPrice },
      { symbol: CurrencySymbol.EU, buy: euroBuyPrice, sell: euroSellPrice },
    ];

    return await this.getPricesFromArray(curr);
  }

  async getEmpireFrameContent(page, pageFrames, url) {
    const contenFrame = pageFrames.find((f) => f.url() === url);
    let contentElement = await contenFrame.$('body > pre');
    return getTextContentForPrices(page, contentElement);
  }
}
