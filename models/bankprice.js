class BankPrice {
    constructor(name, dollarBuy, dollarSell, euroBuy, euroSell, gbpBuy, gbpSell, cadBuy, cadSell) {
      this.name = name;
      this.dollarBuy = dollarBuy;
      this.dollarSell = dollarSell;
      this.euroBuy = euroBuy;
      this.euroSell = euroSell;
      
      this.gbpBuy = gbpBuy;
      this.gbpSell = gbpSell;
      this.cadBuy = cadBuy;
      this.cadSell = cadSell;
    
      this.date = new Date();
    }
  };

  module.exports = BankPrice;