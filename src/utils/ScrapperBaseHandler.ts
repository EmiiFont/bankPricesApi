import {IBankPrice} from "../models/bankprice";

export abstract class ScrapperBaseHandler<T>{
    bankName: string;

    constructor() {
    }

    abstract scrapeData() : IBankPrice;

    run() : IBankPrice {
        try {
            console.log(`now scrapping ${(this.bankName)}`);

            let iBankPrice = this.scrapeData();

            console.log(`finished scrapping ${(this.bankName)}`);

            return iBankPrice;

        }catch (e) {
            console.log(e);
        }
    }
}