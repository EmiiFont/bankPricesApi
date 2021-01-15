import {ScrapperBaseHandler} from "./ScrapperBaseHandler";
import {IBankPrice} from "../models/bankprice";
import {CurrencySymbol, ICurrencyInfo} from "../models/currencyInfo";
import * as puppeteer from 'puppeteer';
import {Banks} from "../models/bankName";
import {getValueForPrices} from "./utils";

export class BancoPopularScrapper extends ScrapperBaseHandler<BancoPopularScrapper>{

    async scrapeData(page: puppeteer.Page): Promise<IBankPrice> {

        this.bankName = Banks.BancoPopular;

        await page.goto('https://www.popularenlinea.com/personas/Paginas/Home.aspx', this.puppeteerPageConfig);
        await page.setViewport({ width: 1920, height: 888 });

        await page.waitForSelector('#tasa_dolar_desktop #compra_peso_dolar_desktop');
        const dollarBuyElement = await page.$('#tasa_dolar_desktop #compra_peso_dolar_desktop');
        const dollarSellElement = await page.$('#tasa_dolar_desktop #venta_peso_dolar_desktop');

        await page.waitForSelector('.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro');
        await page.click('.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro');

        await page.waitForSelector('#tasa_euro_desktop #compra_peso_euro_desktop');
        const euroBuyElement = await page.$('#tasa_euro_desktop #compra_peso_euro_desktop');
        const euroSellElement = await page.$('#tasa_euro_desktop #venta_peso_euro_desktop');

        const dollarBuyPrice = await getValueForPrices(page, dollarBuyElement);
        const dollarSellPrice = await getValueForPrices(page, dollarSellElement);

        const euroBuyPrice = await getValueForPrices(page, euroBuyElement);
        const euroSellPrice = await getValueForPrices(page, euroSellElement);


        const dollar: ICurrencyInfo =  {symbol: CurrencySymbol.US, buy: dollarBuyPrice,
                sell: dollarSellPrice};
        const euro: ICurrencyInfo = {symbol: CurrencySymbol.EU,
            buy: euroBuyPrice,
            sell: euroSellPrice};

        const currencies = [dollar, euro];

        const prices: IBankPrice = {name: 'popular', dollarBuy: dollarBuyPrice,
                dollarSell: dollarSellPrice,
                euroBuy: euroBuyPrice,
                euroSell: euroSellPrice,
                currency: currencies,
                error: false};

        return prices;
    }
}

