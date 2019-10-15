'use strict';

const puppeteer = require('puppeteer');
const BankPrice = require('../models/bankprice');

const getAsociacionAhorrosPrices = async () =>{
    let prices = new BankPrice();//{'name': 'asociacion de ahorros y prestamos','dollarBuy': 0, 'dollarSell': 0, 'euroBuy': 0, 'dollarSell': 0};
    prices.name = 'asociacion de ahorros y prestamos';

    try{

        const browser = await puppeteer.launch();
        
        const page = await browser.newPage();
       
        await page.goto('https://www.apap.com.do/calculadoras/')
  
        await page.setViewport({ width: 1920, height: 937 })
        
        for(let i = 1; i<= 2; i++){
            
            await page.waitForSelector('#navbarNav #currency-label')
            
            await page.click('#navbarNav #currency-label')

            await page.waitForSelector(`.btn-group > .dropdown-menu > .list-inline > li:nth-child(${i}) > .dropdown-item`);
           
            await page.click(`.btn-group > .dropdown-menu > .list-inline > li:nth-child(${i}) > .dropdown-item`);
    
            const buyElement = await page.$("#currency-buy");
           
            const sellElement = await page.$("#currency-sell");

            const buyPrice = await page.evaluate(element => element.textContent, buyElement);
            
            const sellPrice = await page.evaluate(element => element.textContent, sellElement);

            if(i == 1){
                prices.dollarBuy = buyPrice;
                prices.dollarSell = sellPrice;
            } else{
                prices.euroBuy = buyPrice;
                prices.euroSell = sellPrice;
            }
        }
        await browser.close();
    }catch(error){
        console.log(error);
    }
     
return prices;
}

const getBancoCaribePrices = async () =>{
    const browser = await puppeteer.launch();
    
    const page = await browser.newPage();
    
    await page.goto('https://www.bancocaribe.com.do/divisas');
    
    await page.setViewport({ width: 1920, height: 937 });
    
    await page.waitForSelector('.col > .d-inline-flex > .site_exchange-rates > #exchange-rates-button > span');
    await page.click('.col > .d-inline-flex > .site_exchange-rates > #exchange-rates-button > span');
    
    await page.waitForSelector('.container #us_buy_res');
    await page.click('.container #us_buy_res');
    
    const buyElement = await page.$(".container #us_buy_res");
    const sellElement = await page.$(".container #us_sell_res");
    const buyEuroElement = await page.$(".container #eur_buy_res");
    const sellEuroElement = await page.$(".container #eur_sell_res");
  
    const buyPrice = await page.evaluate(element => element.textContent, buyElement);
    const sellPrice = await page.evaluate(element => element.textContent, sellElement);
    const euroBuyPrice = await page.evaluate(element => element.textContent, buyEuroElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, sellEuroElement);
    
    await browser.close();

    const prices = new BankPrice('banco caribe', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

    return prices;
}

const getPromericaPrices = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.promerica.com.do/');

    await page.setViewport({ width: 1920, height: 937 });

    await page.waitForSelector('.row > #tipoCambioHome > .col-sm-6 > nav > .tipoEuro');

    await page.waitForSelector('.container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(1)');

    const buyElement = await page.$('.container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(1)');
    const sellElement = await page.$('.container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(3)');

    const buyPrice = await page.evaluate(element => element.textContent, buyElement);
    const sellPrice = await page.evaluate(element => element.textContent, sellElement);

    await page.click('.row > #tipoCambioHome > .col-sm-6 > nav > .tipoEuro');

    const buyEuroElement = await page.$('.container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(1)');
    const sellEuroElement = await page.$('.container > .row > #tipoCambioHome > .col-sm-6 > .cambio > span:nth-child(3)');

    const euroBuyPrice = await page.evaluate(element => element.textContent, buyEuroElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, sellEuroElement);

    const prices = new BankPrice('banco promerica', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

    await browser.close();

    return prices;
}

const getLopezDeHaroPrices = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto('https://www.blh.com.do/');
    
    await page.setViewport({ width: 1920, height: 937 });
    
    await page.waitForSelector('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
   
    const buyElement = await page.$('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
    const sellElement = await page.$('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
    
    const text = await page.evaluate(element => element.textContent, buyElement);
    
    const buyPrice = text.substring(26, 31);
    const sellPrice = text.substring(34, 39);
    const euroBuyPrice = text.substring(47, 52);
    const euroSellPrice = text.substring(55, 60);

    const prices = new BankPrice('banco lopez de haro', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

    await browser.close();

    return prices;
}

const getBancoBdiPrices = async () => {
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();
  
  await page.goto('https://www.bdi.com.do/');
  
  await page.setViewport({ width: 1920, height: 937 });
  
  const replaceBuy = "Compra";
  const replaceSell = "Venta";

  await page.waitForSelector('.container > .row > .col-sm-6 > .flright > li:nth-child(4)');
  
  const buyElement = await page.$('.container > .row > .col-sm-6 > .flright > li:nth-child(4)');
  const sellElement = await page.$('.container > .row > .col-sm-6 > .flright > .mc_xs_item');

  const textBuyPrice = await page.evaluate(element => element.textContent, buyElement);
  const textSellPrice = await page.evaluate(element => element.textContent, sellElement);

  await page.waitForSelector('.container > .row > .separator > .mc_list > li:nth-child(4)')
 
  const euroBuyElement = await page.$('.container > .row > .separator > .mc_list > li:nth-child(4)');
  const euroSellElement = await page.$('.container > .row > .separator > .mc_list > .mc_xs_item');

  const textEuroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
  const textEuroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);
   
  const buyPrice = textBuyPrice.replace(replaceBuy, "").trim();
  const sellPrice = textSellPrice.replace(replaceSell, "").trim();

  const euroBuyPrice = textEuroBuyPrice.replace(replaceBuy, "").trim();
  const euroSellPrice = textEuroSellPrice.replace(replaceSell, "").trim();

  const prices = new BankPrice('banco bdi', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

  await browser.close();

  return prices;
}

const getBanescoPrices = async () => {
    const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.goto('https://www.banesco.com.do/')
  
  await page.setViewport({ width: 1920, height: 182 })
  
  await page.waitForSelector('.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)')
  
  const pricesElement = await page.$('.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)');
    
  const textBuy = await page.evaluate(element => element.textContent, pricesElement);
  
  const buyPrice = textBuy.substring(12, 17);
  const sellPrice = textBuy.substring(24, 29)
  const euroBuyPrice = textBuy.substring(41, 46);
  const euroSellPrice = textBuy.substring(52, 57);

  const prices = new BankPrice('banesco', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

  await browser.close();

  return prices;
}

module.exports.getAsociacionAhorrosPrices = getAsociacionAhorrosPrices;
module.exports.getPromericaPrices = getPromericaPrices;
module.exports.getBancoCaribePrices = getBancoCaribePrices;
module.exports.getLopezDeHaroPrices = getLopezDeHaroPrices;
module.exports.getBancoBdiPrices = getBancoBdiPrices;
module.exports.getBanescoPrices = getBanescoPrices;