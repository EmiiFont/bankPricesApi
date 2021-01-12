import {ScrapperBaseHandler} from "./ScrapperBaseHandler";
import {IBankPrice} from "../models/bankprice";

export class BancoPopularScrapper extends ScrapperBaseHandler<BancoPopularScrapper>{
    scrapeData(): IBankPrice {
        this.bankName = "Banco Popular";
        return {euroSell: 1, euroBuy: 2, dollarBuy: 3,
            dollarSell: 4, name: "BancoPopular",
            currency: [],
            EUBuyChange: "",
            EUSellChange: "",
            USBuyChange: "",
            USSellChange: "",
            date: new Date(), error: false };
    }
}