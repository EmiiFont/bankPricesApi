import {IBankPrice} from "../models/bankprice";
import * as puppeteer from 'puppeteer';
import * as sentry from '@sentry/node';
import {DirectNavigationOptions} from "puppeteer";

export abstract class ScrapperBaseHandler<T>{
    bankName: string= "empty";
    puppeteerPageConfig: DirectNavigationOptions = { waitUntil: "domcontentloaded", timeout: 0 };

    constructor() {
    }

    protected abstract scrapeData(page: puppeteer.Page) : Promise<IBankPrice>;

    async run(browser: puppeteer.Browser) : Promise<IBankPrice | null> {
        try {
            console.log(`now scrapping ${(this.bankName)}`);

            const page = await browser.newPage();

            await page.setViewport({ width: 1920, height: 937 });

            let iBankPrice = this.scrapeData(page);

            console.log(`finished scrapping ${(this.bankName)}`);

            await page.close();

            return iBankPrice;

        }catch (e) {
            sentry.captureException(e);
            console.log(e);
        }

        return null;
    }
}