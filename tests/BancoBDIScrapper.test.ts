import {BancoBDIScrapper} from "../src/utils/BancoBDIScrapper";

describe("BancoBDIScrapper",  () =>{
    it("expect the scrapeData method to return the correct object", async () => {
        jest.setTimeout(10000);
        let bps = new BancoBDIScrapper();
        const result = await bps.scrapeData(page);

        expect(bps.bankName).toBe("bdi");
        expect(result.euroBuy).toEqual(expect.any(Number));
    })
})