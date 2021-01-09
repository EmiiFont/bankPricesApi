export interface ICurrencyInfo{
     symbol: currencySymbol;
     sell: number;
     buy: number;
}

export type currencySymbol= "US" | "EU" | "CHF" | "GBP" | "CAD";

export class CurrencyInfo{
    private symbol: currencySymbol;
    private sell: number;
    private buy: number;
    constructor(symbol: currencySymbol, buy: number, sell: number){
        this.symbol = symbol;
        this.buy = buy;
        this.sell = sell;
    }
}

