export interface ICurrencyInfo {
  symbol: CurrencySymbol;
  sell: number;
  buy: number;
  sellChange?: ChangeType;
  buyChange?: ChangeType;
}

export type ChangeType = "equal" | "increase" | "decrease";

export enum CurrencySymbol {
  US = "USD",
  EU = "EUR",
  CHF = "CHF",
  GBP = "GBP",
  CAD = "CAD",
}
