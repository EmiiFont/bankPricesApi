import {getTextContentForPrices, getValueForPrices, parseDecimalFromArrayOfString} from "../src/utils/utils";

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
})