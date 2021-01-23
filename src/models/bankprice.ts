import { ICurrencyInfo } from './currencyInfo';

export interface IBankPrice {
  EUSellChange?: string;
  EUBuyChange?: string;
  USSellChange?: string;
  USBuyChange?: string;
  name: string;
  dollarBuy?: number;
  dollarSell?: number;
  euroBuy?: number;
  euroSell?: number;
  error?: boolean;
  currency?: ICurrencyInfo[];
  date?: Date;
}
