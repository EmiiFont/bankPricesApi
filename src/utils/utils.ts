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

export function parseDecimalFromArrayOfString(stringArr: Array<string>): Array<number> {
    const regexToIgnoreSeparators = /(\d|,)+/g; //sometimes prices came as e.g: 12 33, 12,33 and 12.33
    const pricesArr: Array<number> = [];
    const regexWithoutTextContinuing =/\d+[\.\,]\d{0,2}$/;
    const rregexWitTextContinuing =/\d+[\.\,]\d{0,2}/;

    for (let index = 0; index < stringArr.length; index++) {
        const priceEmpty =  stringArr[index].match(regexWithoutTextContinuing) || stringArr[index].match(rregexWitTextContinuing);
        const price = priceEmpty !== null ? priceEmpty.join('') : "";
        const priceNoComma = price.replace(",",".");
        const isValidNumber = priceNoComma.match(regexWithoutTextContinuing)?.pop();

        if(parseFloat(isValidNumber || "0") > 0){
            let parsedNumbersArr =  isValidNumber?.match(regexToIgnoreSeparators);
            if(parsedNumbersArr != null){
                if(parsedNumbersArr[0].length == 3){
                    parsedNumbersArr[0] = parsedNumbersArr[0].substr(1);
                }
                const parseNumber = parsedNumbersArr.join(".");
                pricesArr.push(parseFloat(parseNumber));
            }
        }
    }
    return pricesArr;
}