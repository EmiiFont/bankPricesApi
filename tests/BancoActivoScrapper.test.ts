import {BancoActivoScrapper} from "../src/utils/BancoActivoScrapper";

describe("BancoActivoScrapper",  () =>{
    it("expect the scrapeData method to return the correct object", async () => {
        jest.setTimeout(10000);
        let bps = new BancoActivoScrapper();
        const result = await bps.scrapeData(page);

        expect(bps.bankName).toBe("activo");
        expect(result.euroBuy).toEqual(expect.any(Number));
    })
})