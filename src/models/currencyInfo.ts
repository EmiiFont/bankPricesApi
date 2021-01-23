export interface ICurrencyInfo {
  symbol: CurrencySymbol;
  sell: number;
  buy: number;
}

export enum CurrencySymbol {
  US = 'US',
  EU = 'EU',
  CHF = 'CHF',
  GBP = 'GBP',
  CAD = 'CAD',
}
