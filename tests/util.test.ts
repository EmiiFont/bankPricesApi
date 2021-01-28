import {
    getTextContentForPrices,
    getValueForPrices,
    parseDecimalFromArrayOfString, parsePriceFromText
} from "../src/utils/utils";

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

    it("parseDecimalFromArrayOfString should return array of numbers with extra text", async () =>{

        const text = "Dolares\\nCompra 57.85\\n#Venta 58.30 Siempre hay.\\n#Euro Compra 69.20\\nVenta: 70.60 " +
            "siempre hay\\n#Suizos a 62.70\\n#Canadas 143.20\\n#Libras Esterlinas 76.70 visítanos " +
            "y\\nconseguirás precios especiales.\\n";
        const strArr = text.split("\\n");

        const expected = [57.85,58.30,69.20,70.60,62.70,43.20,76.70];
        const result = parseDecimalFromArrayOfString(strArr);

        expect(result).toEqual(expected)
    });

    it("parseDecimalFromArrayOfString should return array of number without extra text", async () =>{

        const text = "Divisas: Compra US$: RD$58.00 - Venta US$: 58.30" +
            "            Tasas Pasivas: Certificados de Depósito (Desde 5.05% anual)" +
            "            Tasas Activas: Préstamo para Vehículo (Desde 15.95% Anual)"
        ;
        const strArr = text.split("  ")[0].split(" ");

        const expected = [58.0, 58.3];
        const result = parseDecimalFromArrayOfString(strArr);
        expect(result).toEqual(expected)
    });

    it("parseDecimalFromArrayOfString should return an empty array", async () =>{

        const result = parseDecimalFromArrayOfString([]);

        expect(result).toEqual([])
    });

    it("parseDecimalFromArrayOfString should return an empty array if no matching decimal", async () =>{

        const result = parseDecimalFromArrayOfString(["Dolares: 12345 compralos a este precio"]);

        expect(result).toEqual([])
    });

    it("parseDecimalFromArrayOfString should return array of number with decimal formatted with comma", async () =>{

        const text = "Divisas: Compra US$: RD$58,20 - Venta US$: 58,30" +
            "            Tasas Pasivas: Certificados de Depósito (Desde 5.05% anual)" +
            "            Tasas Activas: Préstamo para Vehículo (Desde 15.95% Anual)"
        ;
        const strArr = text.split("  ")[0].split(" ");

        const expected = [58.2, 58.3];
        const result = parseDecimalFromArrayOfString(strArr);

        expect(result).toEqual(expected)
    });

    it("parseDecimalFromArrayOfString should return array from banesco format", async () =>{

        const text = "USD$ - C RD$57.25 V RD$ 58.45 EU$ - C RD$67.83  V RD$72.97 - Estas tasas son de referencia."
        ;
        const strArr = text.split("RD$");

        const expected = [57.25, 58.45, 67.83, 72.97];
        const result = parseDecimalFromArrayOfString(strArr);

        expect(result).toEqual(expected)
    });

    it("parseDecimalFromArrayOfString should return array from lopez de haro format", async () =>{

        const text: any = "\"—————COMPRA—-VENTA\n" +
            "DÓLAR—-57.40———58.45\n" +
            "EUROS—-69.00———72.70 \""
        ;
        const strArr = text.replace(new RegExp("———", 'g'), " ")
            .replace(new RegExp("—-", 'g'), " ")
            .replace(new RegExp("———", 'g'), " ").split(" ");


        const expected = [57.4, 58.45, 69, 72.7];
        const result = parseDecimalFromArrayOfString(strArr);

        expect(result).toEqual(expected)
    });


    it("parsePriceFromText should return a number when successful return of string", async () =>{
        const result = parsePriceFromText("Venta 58.40 compra");
        expect(result).toEqual("58.40");
    })
})