import { ScrapperBaseHandler } from "./ScrapperBaseHandler";
import { Page } from "puppeteer";
import { IBankPrice } from "../models/bankprice";
import { Banks } from "../models/bankName";
import { CurrencySymbol, ICurrencyInfo } from "../models/currencyInfo";
import * as https from "https";
import * as fs from "fs";
import { readDownloadedExcel } from "../utils/excelParser";
import { promiseForStream } from "../utils/functionUtilities";

export class BancoCentralScrapper extends ScrapperBaseHandler<BancoCentralScrapper> {
  async scrapeData(page: Page): Promise<IBankPrice> {
    this.bankName = Banks.BancoCentral;

    let dollarPrices;
    let otherCurrencies;
    const fileNameUs = "bancocentraltasasus.xls";
    const filenameOther = "bancocentraltasasother.xls";

    try {
      fs.unlinkSync(fileNameUs);
      fs.unlinkSync(filenameOther);
    } catch (err) {
      console.log(err);
    }

    const file = fs.createWriteStream(fileNameUs);
    const other = fs.createWriteStream(filenameOther);
    file.on("finish", () => {
      const result = readDownloadedExcel(file.path);
      dollarPrices = result[result.length - 1];
    });

    other.on("finish", () => {
      const result = readDownloadedExcel(other.path);
      otherCurrencies = result[result.length - 1];
    });

    https.get(
      "https://cdn.bancentral.gov.do/documents/estadisticas/mercado-cambiario/documents/TASA_DOLAR_REFERENCIA_MC.xls",
      (response) => {
        response.pipe(file);
      },
    );

    https.get(
      "https://cdn.bancentral.gov.do/documents/estadisticas/mercado-cambiario/documents/TASAS_CONVERTIBLES_OTRAS_MONEDAS.xls",
      (response) => {
        response.pipe(other);
      },
    );

    let curr: Array<ICurrencyInfo> = [];
    await Promise.all([promiseForStream(file), promiseForStream(other)]).then(() => {
      console.log(otherCurrencies["EURO"]);
      console.log(dollarPrices["Compra"]);

      console.log(otherCurrencies["EURO"]);
      console.log(dollarPrices["Compra"]);

      curr = [
        {
          symbol: CurrencySymbol.US,
          buy: parseFloat(dollarPrices["Compra"]),
          sell: parseFloat(dollarPrices["Venta"]),
        },
        { symbol: CurrencySymbol.EU, buy: parseFloat(otherCurrencies["EURO"]), sell: 0 },
        {
          symbol: CurrencySymbol.GBP,
          buy: parseFloat(otherCurrencies["LIBRA ESTERLINA"]),
          sell: 0,
        },
        {
          symbol: CurrencySymbol.CAD,
          buy: parseFloat(otherCurrencies["DOLAR CANADIENSE"]),
          sell: 0,
        },
      ];
    });

    return await this.getPricesFromArray(curr);
  }
}
