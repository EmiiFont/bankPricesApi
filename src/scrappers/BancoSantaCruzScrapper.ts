import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol, ICurrencyInfo } from "../models/currencyInfo";

export class BancoSantaCruzScrapper extends ScrapperBaseHandler<BancoSantaCruzScrapper> {
  bankName = Banks.SantaCruz;
  async scrapeData(page: Page): Promise<IBankPrice> {
    await page.goto("https://www.bsc.com.do/dynresources/wj/bsc/v1/divisas", this.puppeteerPageConfig);

    const parsedJson = await page.evaluate(() => {
      const body = document.querySelector("body");
      return JSON.parse(body != null ? body.innerText : "");
    });

    const usd = parsedJson.usd;
    const eur = parsedJson.eur;
    const gbp = parsedJson.gbp;
    const cad = parsedJson.cad;

    const currencyInfo: ICurrencyInfo[] = [
      {
        symbol: CurrencySymbol.US,
        buy: usd.precio_compra,
        sell: usd.precio_venta,
      },
      {
        symbol: CurrencySymbol.EU,
        buy: eur.precio_compra,
        sell: eur.precio_venta,
      },
      {
        symbol: CurrencySymbol.GBP,
        buy: gbp.precio_compra,
        sell: gbp.precio_venta,
      },
      {
        symbol: CurrencySymbol.CAD,
        buy: cad.precio_compra,
        sell: cad.precio_venta,
      },
    ];

    return await this.getPricesFromArray(currencyInfo);
  }
}
