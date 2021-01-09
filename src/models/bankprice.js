class BankPrice {
    constructor(name, dollarBuy, dollarSell, euroBuy, euroSell, currency, error) {
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