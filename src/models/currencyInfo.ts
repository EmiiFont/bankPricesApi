export interface ICurrencyInfo {
  symbol: CurrencySymbol;
  sell: number;
  buy: number;
  sellChange?: ChangeType;
  buyChange?: ChangeType;
}

export type ChangeType = "change" | "increase" | "decrease";

export enum CurrencySymbol {
  US = "US",
  EU = "EU",
  CHF = "CHF",
  GBP = "GBP",
  CAD = "CAD",
}
