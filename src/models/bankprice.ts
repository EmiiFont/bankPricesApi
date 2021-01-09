import {CurrencyInfo, ICurrencyInfo} from "./currencyInfo";

export interface  IBankPrice{
  name: string;
  dollarBuy: number;
  dollarSell: number;
  euroBuy: number;
  euroSell: number;
  error: boolean;
  currency: ICurrencyInfo[];
  date: Date;
}


class BankPrice {
  private name: string;
  private dollarBuy: number;
  private dollarSell: number;
  private euroBuy: number;
  private euroSell: number;
  private error: boolean;
  private currency: CurrencyInfo[];
  private date: Date;
    constructor(name: string, dollarBuy: number, dollarSell: number,
                euroBuy: number, euroSell: number, currency: CurrencyInfo[], error: boolean) {
      this.name = name;
      this.dollarBuy = dollarBuy;
      this.dollarSell = dollarSell;
      this.euroBuy = euroBuy;
      this.euroSell = euroSell;
      this.error = error;
      this.currency = currency;
      this.date = new Date();
    }
  };


  module.exports = BankPrice;