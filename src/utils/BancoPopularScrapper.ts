import {ScrapperBaseHandler} from "./ScrapperBaseHandler";
import {IBankPrice} from "../models/bankprice";
import {CurrencySymbol, ICurrencyInfo} from "../models/currencyInfo";
import * as puppeteer from 'puppeteer';
import {Banks} from "../models/bankName";

export class BancoPopularScrapper extends ScrapperBaseHandler<BancoPopularScrapper>{

    async scrapeData(page: puppeteer.Page): Promise<IBankPrice> {

        this.bankName = Banks.BancoPopular;

        await page.goto('https://www.popularenlinea.com/personas/Paginas/Home.aspx', this.puppeteerPageConfig);
        await page.waitFor(2000);

        await page.setViewport({ width: 1920, height: 888 });

        await page.waitForSelector('#tasa_dolar_desktop #compra_peso_dolar_desktop');
        const dollarBuyElement = await page.$('#tasa_dolar_desktop #compra_peso_dolar_desktop');
        const dollarSellElement = await page.$('#tasa_dolar_desktop #venta_peso_dolar_desktop');

        await page.waitForSelector('.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro');
        await page.click('.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro');

        await page.waitForSelector('#tasa_euro_desktop #compra_peso_euro_desktop');
        const euroBuyElement = await page.$('#tasa_euro_desktop #compra_peso_euro_desktop');
        const euroSellElement = await page.$('#tasa_euro_desktop #venta_peso_euro_desktop');

        const dollarBuyPrice = await page.evaluate(element => element.value, dollarBuyElement);
        const dollarSellPrice = await page.evaluate(element => element.value, dollarSellElement);

        const euroBuyPrice = await page.evaluate(element => element.value, euroBuyElement);
        const euroSellPrice = await page.evaluate(element => element.value, euroSellElement);

        const dollar: ICurrencyInfo =  {symbol: CurrencySymbol.US, buy: dollarBuyPrice.trim(), sell: dollarSellPrice.trim()};
        const euro: ICurrencyInfo = {symbol: CurrencySymbol.EU, buy: euroBuyPrice.trim(), sell: euroSellPrice.trim()};

        const currencies = [dollar, euro];

        const prices: IBankPrice = {name: 'popular', dollarBuy: dollarBuyPrice.trim(),
                dollarSell: dollarSellPrice.trim(),
                euroBuy: euroBuyPrice.trim(),
                euroSell: euroSellPrice.trim(),
                currency: currencies,
                error: false};

        return prices;
    }
}