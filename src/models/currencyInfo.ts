export interface ICurrencyInfo{
     symbol: CurrencySymbol;
     sell: number;
     buy: number;
}

export enum CurrencySymbol {
    US = "US",
    EU = "EU",
    CHF = "CHF",
    GBP = "GBP",
    CAD = "CAD"
}

export class CurrencyInfo{
    private symbol: CurrencySymbol;
    private sell: number;
    private buy: number;

    constructor(symbol: CurrencySymbol, buy: number, sell: number){
        this.symbol = symbol;
        this.buy = buy;
        this.sell = sell;
    }

}

