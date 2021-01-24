import * as puppeteer from "puppeteer";

const regexWithoutTextContinuing = /\d+[.,]\d{0,2}$/;
const rregexWitTextContinuing = /\d+[.,]\d{0,2}/;

export async function getTextContentForPrices(
  page: puppeteer.Page,
  priceElement: puppeteer.ElementHandle<Element> | null,
): Promise<number> {
  const price = await page.evaluate((element) => element.textContent, priceElement);
  const priceCleaned = parsePriceFromText(price);

  return parseFloat(priceCleaned || "0");
}

export async function getValueForPrices(page: puppeteer.Page, priceElement: puppeteer.ElementHandle<Element> | null): Promise<number> {
  const price = await page.evaluate((element) => element.value, priceElement);
  const priceCleaned = parsePriceFromText(price);
  return parseFloat(priceCleaned || "0");
}

export async function getPriceFromSelector(page: puppeteer.Page, selector: string): Promise<number> {
  await page.waitForSelector(selector);
  const priceElement = await page.$(selector);

  return await getValueForPrices(page, priceElement);
}

export function parsePriceFromText(text: string): string | undefined {
  if (text == undefined) return undefined;

  const priceEmpty = text.match(regexWithoutTextContinuing) || text.match(rregexWitTextContinuing);
  const price = priceEmpty !== null ? priceEmpty.join("") : "";
  const priceNoComma = price.replace(",", ".");
  return priceNoComma.match(regexWithoutTextContinuing)?.pop();
}

export function parseDecimalFromArrayOfString(stringArr: Array<string>): Array<number> {
  const regexToIgnoreSeparators = /(\d|,)+/g; // sometimes prices came as e.g: 12 33, 12,33 and 12.33
  const pricesArr: Array<number> = [];

  for (let index = 0; index < stringArr.length; index++) {
    const isValidNumber = parsePriceFromText(stringArr[index]);
    if (parseFloat(isValidNumber || "0") > 0) {
      const parsedNumbersArr = isValidNumber?.match(regexToIgnoreSeparators);
      if (parsedNumbersArr != null) {
        if (parsedNumbersArr[0].length == 3) {
          parsedNumbersArr[0] = parsedNumbersArr[0].substr(1);
        }
        const parseNumber = parsedNumbersArr.join(".");
        pricesArr.push(parseFloat(parseNumber));
      }
    }
  }
  return pricesArr;
}
