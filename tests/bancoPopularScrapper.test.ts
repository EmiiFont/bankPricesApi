import {BancoPopularScrapper} from "../src/utils/BancoPopularScrapper";
import {IBankPrice} from "../src/models/bankprice";

const fakeData: IBankPrice = {euroSell: 1, euroBuy: 2, dollarBuy: 3,
    dollarSell: 4, name: "BancoPopular",
    currency: [],
    EUBuyChange: "",
    EUSellChange: "",
    USBuyChange: "",
    USSellChange: "",
    date: new Date(), error: false }

describe("BancoPopularScrapper", () =>{
    it("expect the scrapeData method to return the correct object", () => {
        let bps = new BancoPopularScrapper();
        let spy = jest.spyOn(bps, 'scrapeData').mockImplementation(() => fakeData);

        expect(bps.scrapeData()).toBe(fakeData);
        expect(spy).toHaveBeenCalledTimes(1);
    })
})