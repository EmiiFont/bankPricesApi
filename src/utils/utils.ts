import * as puppeteer from 'puppeteer';

export const getTextContentForPrices = async (page: puppeteer.Page,
                                       priceElement: puppeteer.ElementHandle<Element> | null) => {
    const price = await page.evaluate(element => element.textContent, priceElement);
    return parseFloat(price || 0);
}

export const getValueForPrices = async (page: puppeteer.Page,
                                       priceElement: puppeteer.ElementHandle<Element> | null) => {
    const price = await page.evaluate(element => element.value, priceElement);
    return parseFloat(price || 0);
}
