import {ScrapperBaseHandler} from "./ScrapperBaseHandler";
import {Page} from "puppeteer";
import {IBankPrice} from "../models/bankprice";
import {Banks} from "../models/bankName";
import {CurrencySymbol} from "../models/currencyInfo";

export class BanReservasScrapper extends ScrapperBaseHandler<BanReservasScrapper>{
     async scrapeData(page: Page): Promise<IBankPrice> {
        this.bankName = Banks.BanReservas;
         this.usBuyElement = ".currency-box > .currency-box-table > tbody > .even > td:nth-child(2)";
         this.usSellElement = ".currency-box > .currency-box-table > tbody > .even > td:nth-child(3)";
         this.euBuyElement = ".currency-box > .currency-box-table > tbody > .odd:nth-child(3) > td:nth-child(2)";
         this.euSellElement = ".currency-box > .currency-box-table > tbody > .odd:nth-child(3) > td:nth-child(3)";

         this.currenciesElements= [ {
             symbol: CurrencySymbol.US,
             buyElement: this.usBuyElement,
             sellElement: this.usSellElement
         }, {
             symbol: CurrencySymbol.EU,
             buyElement: this.euBuyElement,
             sellElement: this.euSellElement
         }];

        await page.goto('https://www.banreservas.com/', this.puppeteerPageConfig);

        return await this.getPrices();
    }

}