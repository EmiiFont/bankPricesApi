import {getTextContentForPrices, getValueForPrices} from "../src/utils/utils";

describe("utils",() =>{


    it("getTextContentForPrices should return a number", async () =>{
        jest.setTimeout(10000)
        jest.spyOn(page, 'evaluate').mockImplementation(() => new Promise(() => "50.60"))
            .mockResolvedValue("50.60");
        const result = await getTextContentForPrices(page, null);
        expect(result).toEqual(50.60);
    })

    it("getTextContentForPrices should return 0 when empty string", async () =>{
        jest.setTimeout(10000);
        jest.spyOn(page, 'evaluate').mockImplementation(() => new Promise(() => ""))
            .mockResolvedValue("");
        const result = await getTextContentForPrices(page, null);
        expect(result).toEqual(0);
    })

    it("getValueForPrices should return 0 when empty string", async () =>{
        jest.setTimeout(10000);
        jest.spyOn(page, 'evaluate').mockImplementation(() => new Promise(() => ""))
            .mockResolvedValue("");
        const result = await getValueForPrices(page, null);
        expect(result).toEqual(0);
    });

    it("getValueForPrices should return a number", async () =>{
        jest.setTimeout(10000);
        jest.spyOn(page, 'evaluate').mockImplementation(() => new Promise(() => "50.60"))
            .mockResolvedValue("50.60");
        const result = await getValueForPrices(page, null);
        expect(result).toEqual(50.60);
    });

})