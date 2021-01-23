import { CurrencySymbol } from "../models/currencyInfo";

export interface CurrencyElementHolder {
  symbol: CurrencySymbol;
  buyElement?: string;
  sellElement?: string;
}
