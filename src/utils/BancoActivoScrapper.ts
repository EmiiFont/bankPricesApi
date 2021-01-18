import {ScrapperBaseHandler} from "./ScrapperBaseHandler";
import {Page} from "puppeteer";
import {IBankPrice} from "../models/bankprice";
import {Banks} from "../models/bankName";
import {CurrencySymbol} from "../models/currencyInfo";

export class BancoActivoScrapper extends ScrapperBaseHandler<BancoActivoScrapper>{
    async scrapeData(page: Page): Promise<IBankPrice> {
        this.bankName = Banks.BancoActivo;
        this.usBuyElement = ".table > tbody > tr > td:nth-child(2) > .subtitulo-dolar";
        this.usSellElement = ".table > tbody > tr > td:nth-child(3) > .subtitulo-dolar";
        this.euBuyElement = ".table > tbody > tr > td:nth-child(2) > .subtitulo-euro";
        this.euSellElement = ".table > tbody > tr > td:nth-child(3) > .subtitulo-euro";

        this.currenciesElements= [ {
            symbol: CurrencySymbol.US,
            buyElement: this.usBuyElement,
            sellElement: this.usSellElement
        }, {
            symbol: CurrencySymbol.EU,
            buyElement: this.euBuyElement,
            sellElement: this.euSellElement
        }]

        await page.goto("https://www.bancoactivo.com.do/tasas-tarifas.html",
            this.puppeteerPageConfig);

        return  await this.getPrices();;
    }

}