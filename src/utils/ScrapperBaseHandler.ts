import {IBankPrice} from "../models/bankprice";

export abstract class ScrapperBaseHandler<T>{
    bankName: string= "empty";

    constructor() {
    }

    abstract scrapeData() : IBankPrice;

    run() : IBankPrice | null {
        try {
            console.log(`now scrapping ${(this.bankName)}`);

            let iBankPrice = this.scrapeData();

            console.log(`finished scrapping ${(this.bankName)}`);

            return iBankPrice;

        }catch (e) {
            console.log(e);
        }

        return null;
    }
}