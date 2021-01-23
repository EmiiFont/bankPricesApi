import { ScrapperBaseHandler } from './ScrapperBaseHandler';
import { IBankPrice } from '../models/bankprice';
import { CurrencySymbol } from '../models/currencyInfo';
import * as puppeteer from 'puppeteer';
import { Banks } from '../models/bankName';

export class BancoPopularScrapper extends ScrapperBaseHandler<BancoPopularScrapper> {
  async scrapeData(page: puppeteer.Page): Promise<IBankPrice> {
    this.bankName = Banks.BancoPopular;
    this.usBuyElement = '#tasa_dolar_desktop #compra_peso_dolar_desktop';
    this.usSellElement = '#tasa_dolar_desktop #venta_peso_dolar_desktop';
    this.euBuyElement = '#tasa_euro_desktop #compra_peso_euro_desktop';
    this.euSellElement = '#tasa_euro_desktop #venta_peso_euro_desktop';

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
      'https://www.popularenlinea.com/personas/Paginas/Home.aspx',
      this.puppeteerPageConfig,
    );

    await page.waitForSelector(
      '.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro',
    );
    await page.click(
      '.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro',
    );

    return await this.getPrices();
  }
}
