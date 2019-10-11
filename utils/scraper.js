'use strict';

const puppeteer = require('puppeteer');

const getAsociacionAhorrosPrices = async () =>{
    let prices = {'name': 'asociacion de ahorros y prestamos','dollarBuy': 0, 'dollarSell': 0, 'euroBuy': 0, 'dollarSell': 0};

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
    
            let buyElement = await page.$("#currency-buy");
           
            let sellElement = await page.$("#currency-sell");

            let buyPrice = await page.evaluate(element => element.textContent, buyElement);
            
            let sellPrice = await page.evaluate(element => element.textContent, sellElement);

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

    let prices = {'name': 'banco caribe', 'dollarBuy': buyPrice, 'dollarSell': sellPrice, 'euroBuy': euroBuyPrice, 'euroSell': euroSellPrice};

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

    let prices = {'name': 'banco promerica', 'dollarBuy': buyPrice, 'dollarSell': sellPrice, 'euroBuy': euroBuyPrice, 'euroSell': euroSellPrice};

    await browser.close();

    return prices;
}

module.exports.getAsociacionAhorrosPrices = getAsociacionAhorrosPrices;
module.exports.getPromericaPrices = getPromericaPrices;
module.exports.getBancoCaribePrices = getBancoCaribePrices;