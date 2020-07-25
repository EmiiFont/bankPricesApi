'use strict';

const puppeteer = require('puppeteer');
const https = require('https');
const BankPrice = require('../models/bankprice');
const puppeteerPageConfig = { waitUntil: 'domcontentloaded', timeout: 0 };
const Twitter = require('twitter-lite');
const fs = require('fs');
const got = require('got');
const stream = require('stream');
const {promisify} = require('util');
const sentry = require('@sentry/node')
const excelpar = require('../utils/excelParser')
const functionPromise = require('../utils/functionUtilities');
const { exception } = require('console');

const path = './images/image.png';
const DOLLAR_SYMBOL = "US";
const EURO_SYMBOL = "EU";
const FRANC_SYMBOL = "CHF";
const POUND_SYMBOL = "GBP";
const CAD_SYMBOL = "CAD";

class CurrencyInfo{
  constructor(symbol, buy, sell){
    this.symbol = symbol;
    this.buy = buy;
    this.sell = sell;
  }
}



const initNavigation = async () => {
  const browser = await puppeteer.launch();

   //  getCaribeExpressPrices(browser),
  let allPrices = await Promise.all([
    getPricesFromEmpire(browser),
    getjmmbPrices(browser),
    getCaribeExpressPrices(browser),
    getBanReservasPrices(browser),
    getBancoPopularPrices(browser),
    getScotiaBankPrices(browser),
     getBancoActivoPrices(browser),
     getBancoBdiPrices(browser),
     getBancoCaribePrices(browser),
      getBanescoPrices(browser),
      getPromericaPrices(browser),
     getLopezDeHaroPrices(browser),
     getBancoVimencaPrices(browser),
     getBancoLafise(browser),
     getAcnPrices(browser),
    getBancamericaPrices(browser),
    getBancoSantaCruzPrices(browser),
    getAsociacionAhorrosPrices(browser),
     getAsociacionNacionalPrices(browser),
     getPeraviaPrices(browser),
    getPricesFromBancoCentral(),
    getMarcosCambioPrices(),
    getBhdLeonPrices(browser),
      getQuezadaPrices(browser),
      getAcnPrices(browser)
  ].map(p => p.catch(error => {
    sentry.captureException(error);
    console.log(error);
  })));

  await browser.close();

  return allPrices;
}

const getAsociacionAhorrosPrices = async (browser) => {

  let prices = new BankPrice();//{'name': 'asociacion de ahorros y prestamos','dollarBuy': 0, 'dollarSell': 0, 'euroBuy': 0, 'dollarSell': 0};

  prices.name = 'asociacionPopular';

  try {

    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 937 });

    await page.goto('https://www.apap.com.do/calculadoras/', puppeteerPageConfig);
    
    let currencies = [];

    for (let i = 1; i <= 2; i++) {

      await page.waitForSelector('#navbarNav #currency-label')

      await page.click('#navbarNav #currency-label')

      await page.waitForSelector(`.btn-group > .dropdown-menu > .list-inline > li:nth-child(${i}) > .dropdown-item`);

      await page.click(`.btn-group > .dropdown-menu > .list-inline > li:nth-child(${i}) > .dropdown-item`);

      const buyElement = await page.$("#currency-buy");

      const sellElement = await page.$("#currency-sell");

      const buyPrice = await page.evaluate(element => element.textContent, buyElement);

      const sellPrice = await page.evaluate(element => element.textContent, sellElement);

      if (i == 1) {
        prices.dollarBuy = buyPrice;
        prices.dollarSell = sellPrice;
        currencies.push(new CurrencyInfo(DOLLAR_SYMBOL, buyPrice, sellPrice));
      } else {
        prices.euroBuy = buyPrice;
        prices.euroSell = sellPrice;
        currencies.push(new CurrencyInfo(EURO_SYMBOL, buyPrice, sellPrice));
      }
    }
    
    prices.currency = currencies;
    await page.close();

    return prices;

  } catch (error) {
    sentry.captureException(error);
    console.log(error);
  }
  console.log(prices);
}

const getBancoCaribePrices = async (browser) => {

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 937 });
  await page.goto('https://www.bancocaribe.com.do/divisas', puppeteerPageConfig);

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

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL,  buyPrice, sellPrice);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);
 
  let currencies = [dollar, euro];

  const prices = new BankPrice('caribe', buyPrice, sellPrice, euroBuyPrice, euroSellPrice, currencies, false);
  console.log(prices);

  await page.close();
  return prices;
}

const getPromericaPrices = async (browser) => {

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 937 });
  await page.goto('https://www.promerica.com.do/', puppeteerPageConfig);
  await page.waitFor(2000);

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

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL,  buyPrice, sellPrice);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);
 
  let currencies = [dollar, euro];

  const prices = new BankPrice('promerica', buyPrice, sellPrice, euroBuyPrice, euroSellPrice, currencies, false);

  console.log(prices);

  await page.close();
  return prices;
}

const getLopezDeHaroPrices = async (browser) => {

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 937 });

  await page.goto('https://www.blh.com.do/', puppeteerPageConfig);

  await page.waitForSelector('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');

  const buyElement = await page.$('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
  const sellElement = await page.$('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');

  const text = await page.evaluate(element => element.textContent, buyElement);

  const buyPrice = text.substring(26, 31);
  const sellPrice = text.substring(34, 39);
  const euroBuyPrice = text.substring(47, 52);
  const euroSellPrice = text.substring(55, 60);

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL,  buyPrice, sellPrice);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);
 
  let currencies = [dollar, euro];

  const prices = new BankPrice('lopezDeHaro', buyPrice, sellPrice, euroBuyPrice, euroSellPrice, currencies, false);

  console.log(prices);

  await page.close();
  return prices;
}

const getBancoBdiPrices = async (browser) => {
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 937 });
  await page.goto('https://www.bdi.com.do/', puppeteerPageConfig);


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

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL,  buyPrice, sellPrice);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);
 
  let currencies = [dollar, euro];

  const prices = new BankPrice('bdi', buyPrice, sellPrice, euroBuyPrice, euroSellPrice, currencies, false);

  console.log(prices);

  await page.close();
  return prices;
}

const getBanescoPrices = async (browser) => {
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 937 });

  await page.goto('https://www.banesco.com.do/', puppeteerPageConfig);

 
  await page.waitForSelector('.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)');

  const pricesElement = await page.$('.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)');

  const textBuy = await page.evaluate(element => element.textContent, pricesElement);
 
  let splittedText = textBuy.split("RD$");
  const regex = /[\d\.]+/;

  const buyPrice = parseFloat(splittedText[1].match(regex) || 0);
  const sellPrice = parseFloat(splittedText[2].match(regex) || 0);
  const euroBuyPrice = parseFloat(splittedText[3].match(regex) || 0);
  const euroSellPrice = parseFloat(splittedText[4].match(regex) || 0);

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL,  buyPrice, sellPrice);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);
 
  let currencies = [dollar, euro];
 
  let showError = false;

  if(buyPrice == 0 || sellPrice == 0 || euroBuyPrice ==0 || euroSellPrice == 0) showError = true;

  const prices = new BankPrice('banesco', buyPrice, sellPrice, euroBuyPrice, euroSellPrice, currencies, showError);

  console.log(prices);

  await page.close();
  return prices;
}

const getCaribeExpressPrices = async (browser) => {
  try{

  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 937 });

  await page.goto('https://caribeexpress.com.do/', puppeteerPageConfig);
  
  await page.waitFor(3000);

  await page.waitForSelector('#content-wrapper > .container > .plan:nth-child(3) > .plan-price > .value');

  let dollarBuyElement = await page.$('#content-wrapper > .container > .plan:nth-child(3) > .plan-price > .value');
  let euroBuyElement = await page.$('#content-wrapper > .container > .plan:nth-child(4) > .plan-price > .value');

  const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
  const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL,  dollarBuyPrice.trim(), 0);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.trim(), 0);
 
  let currencies = [dollar, euro];

  const prices = new BankPrice('caribeExpress', dollarBuyPrice.trim(), 0, euroBuyPrice.trim(), 0, currencies);

  console.log(prices);

  await page.close();
  return prices;
 }
 catch(error){
   return new BankPrice('caribeExpress', 0, 0, 0, 0, currencies, true);
 }
 
}

const getBanReservasPrices = async (browser) => {

  try {
    const page = await browser.newPage();

    await page.goto('https://www.banreservas.com/', puppeteerPageConfig);

    await page.setViewport({ width: 1920, height: 888 });

    await page.waitForSelector('.currency-box > .currency-box-table > tbody > .even > td:nth-child(2)');

    const dollarBuyElement = await page.$('.currency-box > .currency-box-table > tbody > .even > td:nth-child(2)');
    const dollarSellElement = await page.$('.currency-box > .currency-box-table > tbody > .even > td:nth-child(3)');

    const euroBuyElement = await page.$('.currency-box > .currency-box-table > tbody > .odd:nth-child(3) > td:nth-child(2)');
    const euroSellElement = await page.$('.currency-box > .currency-box-table > tbody > .odd:nth-child(3) > td:nth-child(3)');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.trim(), dollarSellPrice.trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.trim(), euroSellPrice.trim());
   
    let currencies = [dollar, euro];

    const prices = new BankPrice('banreservas', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim(), currencies, false);

    console.log(prices);

    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('banreservas', 0, 0, 0, 0, [], true);
  }
}

const getBancoPopularPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.popularenlinea.com/personas/Paginas/Home.aspx', puppeteerPageConfig);
    await page.waitFor(2000);
   
    await page.setViewport({ width: 1920, height: 888 });

    await page.waitForSelector('#tasa_dolar_desktop #compra_peso_dolar_desktop');
    const dollarBuyElement = await page.$('#tasa_dolar_desktop #compra_peso_dolar_desktop');
    const dollarSellElement = await page.$('#tasa_dolar_desktop #venta_peso_dolar_desktop');

    await page.waitForSelector('.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro');
    await page.click('.contenido_footer_estatico_listas > .wrapper_tabs_fecha > .tasas_tabs > li > .btn_tasa_euro');

    await page.waitForSelector('#tasa_euro_desktop #compra_peso_euro_desktop');
    const euroBuyElement = await page.$('#tasa_euro_desktop #compra_peso_euro_desktop');
    const euroSellElement = await page.$('#tasa_euro_desktop #venta_peso_euro_desktop');

    const dollarBuyPrice = await page.evaluate(element => element.value, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.value, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.value, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.value, euroSellElement);
    
    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.trim(), dollarSellPrice.trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.trim(), euroSellPrice.trim());
   
    let currencies = [dollar, euro];

    const prices = new BankPrice('popular', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {

    sentry.captureException(error);
    console.log(error);
    return new BankPrice('popular', 0,0,0,0,[], true);
  }
}


const getBhdLeonPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.bhdleon.com.do', puppeteerPageConfig)

    await page.setViewport({ width: 1920, height: 937 })

    await page.waitForSelector('.footer-content-menu');
    const dialogWithTasas = await page.$x("//a[contains(., 'Tasas de Cambio')]");

    await dialogWithTasas[0].click();
    await page.waitForSelector('#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(2)')
    const dollarBuyElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(2)')
    const dollarSellElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(3)')

    const euroBuyElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(3) > td:nth-child(2)');
    const euroSellElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(3) > td:nth-child(3)');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.replace("DOP", "").trim(), dollarSellPrice.replace("DOP", "").trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.replace("DOP", "").trim(), euroSellPrice.replace("DOP", "").trim());
   
    let currencies = [dollar, euro];

    const prices = new BankPrice('bhdleon', dollarBuyPrice.replace("DOP", "").trim(), dollarSellPrice.replace("DOP", "").trim(), euroBuyPrice.replace("DOP", "").trim(), euroSellPrice.replace("DOP", "").trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('bhdleon', 0,0,0,0,[], true);
  }
}
const getScotiaBankPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://do.scotiabank.com/banca-personal/tarifas/tasas-de-cambio.html', puppeteerPageConfig)

    await page.setViewport({ width: 1920, height: 888 })

     
      // await page.waitForSelector('.\_bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(3)')
      // await page.click('.\_bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(3)')
      
      // await page.waitForSelector('.\_bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(4)')
      // await page.click('.\_bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(4)')
      
      // await page.waitForSelector('.\_bns--table > .bns--table > tbody > tr:nth-child(3) > td:nth-child(3)')
      // await page.click('.\_bns--table > .bns--table > tbody > tr:nth-child(3) > td:nth-child(3)')
      
      // await page.waitForSelector('.\_bns--table > .bns--table > tbody > tr:nth-child(3) > td:nth-child(4)')
      // await page.click('.\_bns--table > .bns--table > tbody > tr:nth-child(3) > td:nth-child(4)')
      
      // await page.waitForSelector('.\_bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(3)')
      // await page.click('.\_bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(3)')
      
      // await page.waitForSelector('.\_bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(4)')
      // await page.click('.\_bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(4)')


    const dollarBuyElement = await page.$('.\_bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(3)');
    const dollarSellElement = await page.$('.\_bns--table > .bns--table > tbody > tr:nth-child(2) > td:nth-child(4)');

    const euroBuyElement = await page.$('.\_bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(3)');
    const euroSellElement = await page.$('.\_bns--table > .bns--table > tbody > tr:nth-child(4) > td:nth-child(4)');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.trim(), dollarSellPrice.trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.trim(), euroSellPrice.trim());
   
    let currencies = [dollar, euro];

    const prices = new BankPrice('scotiaBank', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('scotiaBank', "", "", "", "","", "", "","", true);
  }

}

const getBancoActivoPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.bancoactivo.com.do/tasas-tarifas.html', puppeteerPageConfig)

    await page.setViewport({ width: 1920, height: 888 })

    await page.waitForSelector('.table > tbody > tr > td:nth-child(2) > .subtitulo-dolar');
    const dollarBuyElement = await page.$('.table > tbody > tr > td:nth-child(2) > .subtitulo-dolar');
    const dollarSellElement = await page.$('.table > tbody > tr > td:nth-child(3) > .subtitulo-dolar');

    const euroBuyElement = await page.$('.table > tbody > tr > td:nth-child(2) > .subtitulo-euro');
    const euroSellElement = await page.$('.table > tbody > tr > td:nth-child(3) > .subtitulo-euro');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.trim(), dollarSellPrice.trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.trim(), euroSellPrice.trim());
   
    let currencies = [dollar, euro];

    const prices = new BankPrice('activo', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;

  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('activo', 0,0,0,0, [], true);
  }

}

const getBancoSantaCruzPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.bsc.com.do/dynresources/wj/bsc/v1/divisas', puppeteerPageConfig);

    await page.setViewport({ width: 1920, height: 888 });

    let parsedJson = await page.evaluate(() => {
      return JSON.parse(document.querySelector("body").innerText);
    });

    console.log(parsedJson);
    const usd = parsedJson.usd;
    const eur = parsedJson.eur;
    const gbp = parsedJson.gbp;
    const cad = parsedJson.cad;

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, usd.precio_compra, usd.precio_venta);
    let euro = new CurrencyInfo(EURO_SYMBOL, eur.precio_compra, eur.precio_venta);
    let gbpCurrency = new CurrencyInfo(POUND_SYMBOL, gbp.precio_compra, gbp.precio_venta);
    let cadCurrency = new CurrencyInfo(CAD_SYMBOL, cad.precio_compra, cad.precio_venta);
   
    let currencies = [dollar, euro, gbpCurrency, cadCurrency];

    const prices = new BankPrice('santaCruz', usd.precio_compra, usd.precio_venta, eur.precio_compra, eur.precio_venta, currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('santaCruz', 0,0,0,0, [], true);
  }

}

const getBancoVimencaPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.bancovimenca.com/', puppeteerPageConfig);
    await page.waitFor(2000);

    await page.setViewport({ width: 1920, height: 888 });

    await page.waitForSelector('.uk-clearfix:nth-child(1) > .layout-uikit > .uk-nbfc > .uk-margin > .saleValue');

    const dollarBuyElement = await page.$('.uk-clearfix:nth-child(1) > .layout-uikit > .uk-nbfc > .uk-margin > .purchaseValue');

    const dollarSellElement = await page.$('.uk-clearfix:nth-child(1) > .layout-uikit > .uk-nbfc > .uk-margin > .saleValue');

    const euroBuyElement = await page.$('.uk-clearfix:nth-child(2) > .layout-uikit > .uk-nbfc > .uk-margin > .purchaseValue');

    const euroSellElement = await page.$('.uk-clearfix:nth-child(2) > .layout-uikit > .uk-nbfc > .uk-margin > .saleValue');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);
    
    let dollar = new CurrencyInfo(DOLLAR_SYMBOL,dollarBuyPrice.trim(), dollarSellPrice.trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.trim(), euroSellPrice.trim());
   
    let currencies = [dollar, euro];


    const prices = new BankPrice('vimenca', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('vimenca', 0,0,0,0, [], true);
  }

}

const getBancamericaPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.bancamerica.com.do/', puppeteerPageConfig);

    await page.setViewport({ width: 1920, height: 888 });

    await page.waitForSelector('.contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(4)');

    const dollarBuyElement = await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(4)');
    const dollarSellElement = await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(8)');

    const euroBuyElement = await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(2) > strong:nth-child(4)');
    const euroSellElement = await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(2) > strong:nth-child(8)');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.replace("RD$", "").trim(), dollarSellPrice.replace("RD$", "").trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.replace("RD$", "").trim(), euroSellPrice.replace("RD$", "").trim());
   
    let currencies = [dollar, euro];


    const prices = new BankPrice('bancamerica', dollarBuyPrice.replace("RD$", "").trim(), dollarSellPrice.replace("RD$", "").trim(), euroBuyPrice.replace("RD$", "").trim(), euroSellPrice.replace("RD$", "").trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('bancamerica', 0,0,0,0, [], true);
  }

}

const getBancoLafise = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.lafise.com/blrd', puppeteerPageConfig);

    await page.setViewport({ width: 1920, height: 888 });

    await page.waitForSelector('.ng-scope > .lafise-group > .lista:nth-child(1) > .lafise-TasaCambio > .lafise-valorCompra:nth-child(4)');

    const dollarBuyElement = await page.$('.ng-scope > .lafise-group > .lista:nth-child(1) > .lafise-TasaCambio > .lafise-valorCompra:nth-child(4)');

    const dollarSellElement = await page.$('.ng-scope > .lafise-group > .lista:nth-child(1) > .lafise-TasaCambio > .lafise-valorVenta:nth-child(5)');

    const euroBuyElement = await page.$('.ng-scope > .lafise-group > .lista:nth-child(2) > .lafise-TasaCambio > .lafise-valorCompra:nth-child(4)');

    const euroSellElement = await page.$('.ng-scope > .lafise-group > .lista:nth-child(2) > .lafise-TasaCambio > .lafise-valorVenta:nth-child(5)');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.replace("DOP:", "").trim(), dollarSellPrice.replace("USD:", "").trim());
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice.replace("DOP:", "").trim(), euroSellPrice.replace("EUR:", "").trim());
   
    let currencies = [dollar, euro];

    const prices = new BankPrice('lafise', dollarBuyPrice.replace("DOP:", "").trim(), dollarSellPrice.replace("USD:", "").trim(), euroBuyPrice.replace("DOP:", "").trim(), euroSellPrice.replace("EUR:", "").trim(), currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('lafise', 0,0,0,0,[], true);
  }

}

const getAsociacionNacionalPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.alnap.com.do/', puppeteerPageConfig);

    await page.setViewport({ width: 1920, height: 888 });

    await page.waitForSelector('.block-content > table > tbody > tr > td:nth-child(3)');
    const dollarBuyElement = await page.$('.block-content > table > tbody > tr > td:nth-child(3)');
    const dollarSellElement = await page.$('.block-content > table > tbody > tr > td:nth-child(4)');

    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.trim(), dollarSellPrice.trim());
    let currencies = [dollar];

    const prices = new BankPrice('asociacionNacional', dollarBuyPrice.trim(), dollarSellPrice.trim(), 0, 0, currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('asociacionNacional', 0,0,0,0, [], true);
  }

}

const getAcnPrices = async (browser) => {
  try {
    const page = await browser.newPage()

    await page.goto('https://acn.com.do/', puppeteerPageConfig)

    await page.setViewport({ width: 1920, height: 937 })

    await page.waitForSelector('.premium:nth-child(2) > .plan-features > ul > li:nth-child(1) > h4')
    const dollaBuyElement = await page.$('.premium:nth-child(2) > .plan-features > ul > li:nth-child(1) > h4');

    const euroBuyElement = await page.$('.premium:nth-child(3) > .plan-features > ul > li:nth-child(1) > h4');

    const gbpBuyElement = await page.$('.premium:nth-child(3) > .plan-features > ul > li:nth-child(1) > h4');

    const chfBuyElement = await page.$('.featured:nth-child(4) > .plan-features > ul > li:nth-child(1) > h4');

    const cadBuyElement = await page.$('.featured:nth-child(2) > .plan-features > ul > li:nth-child(1) > h4');

    const dollarBuyPrice = await page.evaluate(element => element.textContent.substring(1, 6), dollaBuyElement);
    const euroBuyPrice = await page.evaluate(element => element.textContent.substring(1, 6), euroBuyElement);
    const gbpBuyPrice = await page.evaluate(element => element.textContent.substring(1, 6), gbpBuyElement);
    const chfBuyPrice = await page.evaluate(element => element.textContent.substring(1, 6), chfBuyElement);
    const cadBuyPrice = await page.evaluate(element => element.textContent.substring(1, 6), cadBuyElement);

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice, 0);
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, 0);
    let cad = new CurrencyInfo(CAD_SYMBOL, cadBuyPrice, 0);
    let gbp = new CurrencyInfo(POUND_SYMBOL, gbpBuyPrice, 0,);
   
    let currencies = [dollar, euro, cad, gbp];

    const prices = new BankPrice('acn', dollarBuyPrice, 0, euroBuyPrice, 0, currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('acn', 0,0,0,0, [], true);
  }

}

const getQuezadaPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('http://agentedecambioquezada.com/divisas.html', puppeteerPageConfig)
    await page.waitFor(2000);

    await page.setViewport({ width: 1920, height: 937 })

    await page.waitForSelector('.blog-content-wrapper > .blog-content > ul > .da-ef > strong');

    const dollarElement = await page.$('.blog-content-wrapper > .blog-content > ul > .da-ef > strong');
    const euroElement = await page.$('.blog-content-wrapper > .blog-content > ul > .e-ef > strong');
    const cadElement = await page.$('.blog-content-wrapper > .blog-content > ul > .dc-ef > strong');
    const francElement = await page.$('.blog-content-wrapper > .blog-content > ul > .fs-ef > strong');
    const poundElement = await page.$('.blog-content-wrapper > .blog-content > ul > .le-ef > strong');

    let textDollar = await page.evaluate(element => element.textContent, dollarElement);
    let textEuro = await page.evaluate(element => element.textContent, euroElement);
    let textCad = await page.evaluate(element => element.textContent, cadElement);
    let textFranc = await page.evaluate(element => element.textContent, francElement);
    let textPound = await page.evaluate(element => element.textContent, poundElement);


    let dollarPrices =  quezadaHelper(textDollar);
    let dollarBuy = dollarPrices.buyPrice;
    let dollarSell = dollarPrices.sellPrice;

    let euroPrices =  quezadaHelper(textEuro);
    let euroBuy = euroPrices.buyPrice;
    let euroSell = euroPrices.sellPrice;

    let cadPrices =  quezadaHelper(textCad);
    let cadBuy = cadPrices.buyPrice;
    let cadSell = cadPrices.sellPrice;

    let francprices =  quezadaHelper(textFranc);
    let francBuy = francprices.buyPrice;
    let francSell = francprices.sellPrice;

    let poundPrices =  quezadaHelper(textPound);
    let poundBuy = poundPrices.buyPrice;
    let poundSell = poundPrices.sellPrice;

    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuy, dollarSell);
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuy, euroSell);
    let cad = new CurrencyInfo(CAD_SYMBOL, cadBuy, cadSell);
    let franc = new CurrencyInfo(FRANC_SYMBOL, francBuy, francSell);
    let pound = new CurrencyInfo(POUND_SYMBOL, poundBuy, poundSell);
   
    let currencies = [dollar, euro, cad, franc, pound];

    const prices = new BankPrice('quezada', dollarBuy, dollarSell, euroBuy, euroSell, currencies, false);

    console.log(prices);
    await page.close();
    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('quezada', 0, 0, 0, 0, 0, 0, 0, 0, true);
  }
}

function quezadaHelper(textWithPRices){
  let buy, sell;
  let textArr = textWithPRices.split("-");
  if(textArr.length > 1){
    buy = textArr[0].replace("COMPRA:","").trim();
    sell = textArr[1].replace("VENTA","").trim();
  }
  return {buyPrice: buy, sellPrice: sell};
}

const getPeraviaPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://asociacionperavia.com.do/', puppeteerPageConfig);

    await page.setViewport({ width: 1920, height: 937 });

    await page.waitForSelector('.row > .col-sm-8 > .tasas > .compra:nth-child(2) > strong');
    const buyElement = await page.$('.row > .col-sm-8 > .tasas > .compra:nth-child(2) > strong');

    const sellElement = await page.$('.row > .col-sm-8 > .tasas > .compra:nth-child(3) > strong');

    const dollarBuyPrice = await getTextContentForPrices(page, buyElement);
    const dollarSellPrice = await getTextContentForPrices(page, sellElement);
    
    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice.replace("RD$", "").trim(), dollarSellPrice.replace("RD$", "").trim());
 
    let currencies = [dollar];

    const prices = new BankPrice('peravia', dollarBuyPrice.replace("RD$", "").trim(), dollarSellPrice.replace("RD$", "").trim(), 0, 0, currencies, false);
    
    await page.close();

    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('pervia', 0,0,0,0,[], true);
  }
}

const getProgesoPrices = async (browser) => {
  try {
    const page = await browser.newPage();

    await page.goto('https://www.progreso.com.do/', puppeteerPageConfig);
    await page.waitFor(2000);

    await page.setViewport({ width: 1920, height: 937 });

    await page.waitForSelector('.diario > .box4 > .row > .col-xs-3:nth-child(1) > h3')
    let dollarBuyElement = await page.$('.diario > .box4 > .row > .col-xs-3:nth-child(1) > h3')
    let dollarSellElement =await page.$('.diario > .box4 > .row > .col-xs-3:nth-child(2) > h3')
    let euroBuyElement =await page.$('.diario > .box4 > .row > .col-xs-3:nth-child(3) > h3')
    let euroSellElement =await page.$('.diario > .box4 > .row > .col-xs-3:nth-child(4) > h3')

    const dollarBuyPrice = await getTextContentForPrices(page, dollarBuyElement);
    const dollarSellPrice = await getTextContentForPrices(page, dollarSellElement);
    const euroBuyPrice = await getTextContentForPrices(page, euroBuyElement);
    const euroSellPrice = await getTextContentForPrices(page, euroSellElement);
    
    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice, dollarSellPrice);
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);
 
    let currencies = [dollar, euro];

    const prices = new BankPrice('progreso', dollarBuyPrice, dollarSellPrice, euroBuyPrice, euroSellPrice, currencies, false);
    
    await page.close();

    return prices;
  }
  catch (error) {
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('progreso', 0,0,0,0,[], true);
  }
}


const getPricesFromEmpire =  async(browser) => {

  try{

  const page = await browser.newPage();
  
  await page.goto('https://www.bancoempire.com.do');
  
  await page.setViewport({ width: 1920, height: 937 });
  
  let frames = await page.frames()
  const dollarBuyPrice = await getEmpireFrameContent(page, frames, 'https://www.bancoempire.com.do/txt/dollarcompra.txt');
  const dollarSellPrice = await getEmpireFrameContent(page, frames, 'https://www.bancoempire.com.do/txt/dollarventa.txt');
  const euroBuyPrice = await getEmpireFrameContent(page, frames, 'https://www.bancoempire.com.do/txt/eurocompra.txt');
  const euroSellPrice = await getEmpireFrameContent(page, frames, 'https://www.bancoempire.com.do/txt/euroventa.txt');

  let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice, dollarSellPrice);
 
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);

  let currencies = [dollar, euro];

  const prices = new BankPrice('empire', dollarBuyPrice, dollarSellPrice, euroBuyPrice, euroSellPrice, currencies, false);
  
  await page.close();

  return prices;
}
  catch(error){
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('empire', 0,0,0,0,[], true);
  }
}

const getEmpireFrameContent = async (page, pageFrames, url) => {
  const contenFrame = pageFrames.find(f => f.url() === url);
  let contentElement = await contenFrame.$('body > pre');
  const content =  await getTextContentForPrices(contenFrame, contentElement);

  return content;
}

const getjmmbPrices = async (browser) =>{
  try{

    const page = await browser.newPage();
  
  await page.goto('https://do-bank.jmmb.com/es/tasas-de-referencia#tasadecambio')
  
  await page.setViewport({ width: 2752, height: 962 })
  
  await page.waitFor(1000)
  
  const dollarBuyElement = await page.$('.table-wrapper:nth-child(3) > .main-table > tbody > tr:nth-child(3) > td:nth-child(2)')
  
  const dollarSellElement = await page.$('.table-wrapper > .main-table > tbody > tr:nth-child(3) > td:nth-child(3)')
  
  const euroBuyElement =await page.$('.table-wrapper:nth-child(3) > .main-table > tbody > tr:nth-child(4) > td:nth-child(2)')
  
  const euroSellElement =await page.$('.table-wrapper > .main-table > tbody > tr:nth-child(4) > td:nth-child(3)')
  
  const dollarBuyPrice = await getTextContentForPrices(page, dollarBuyElement);
  const dollarSellPrice = await getTextContentForPrices(page, dollarSellElement);
  const euroBuyPrice = await getTextContentForPrices(page, euroBuyElement);
  const euroSellPrice = await getTextContentForPrices(page, euroSellElement);
  
  let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarBuyPrice, dollarSellPrice);
  let euro = new CurrencyInfo(EURO_SYMBOL, euroBuyPrice, euroSellPrice);

  let currencies = [dollar, euro];

  const prices = new BankPrice('jmmb', dollarBuyPrice, dollarSellPrice, euroBuyPrice, euroSellPrice, currencies, false);
  
  await page.close();

  return prices;

}
catch(error){
  sentry.captureException(error);
  console.log(error);
  return new BankPrice('jmmb', 0,0,0,0,[], true);
  }
}


const getPricesFromBancoCentral = async() =>{
  let dollarPrices;
  let otherCurrencies; 
  const fileNameUs = "bancocentraltasasus.xls";
  const filenameOther = "bancocentraltasasother.xls";

  try {
      var sourceUrls = "bancocentraltasas.xls";
      fs.unlinkSync(fileNameUs);
      fs.unlinkSync(filenameOther);
     } catch(err){
      console.log(err);
  }

  const file = fs.createWriteStream(fileNameUs);
  const other = fs.createWriteStream(filenameOther);
  file.on('finish', function() {
      let result = excelpar.readDownloadedExcel(file.path);
      dollarPrices = result[result.length - 1];
   });

  other.on('finish', function() {
      let result = excelpar.readDownloadedExcel(other.path);
      otherCurrencies = result[result.length - 1];
  });

  const requestus = https.get("https://cdn.bancentral.gov.do/documents/estadisticas/mercado-cambiario/documents/TASA_DOLAR_REFERENCIA_MC.xls", function(response) {
      response.pipe(file);
    });

    const request = https.get("https://cdn.bancentral.gov.do/documents/estadisticas/mercado-cambiario/documents/TASAS_CONVERTIBLES_OTRAS_MONEDAS.xls", function(response) {
      response.pipe(other);
    });

  let prices = new BankPrice();
 
  await Promise.all([functionPromise.promiseForStream(file), functionPromise.promiseForStream(other)]).then(() => {
      console.log(otherCurrencies['EURO']);
      console.log(dollarPrices['Compra']);
       
     let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dollarPrices['Compra'], dollarPrices['Venta']);
     let euro = new CurrencyInfo(EURO_SYMBOL, otherCurrencies['EURO'], 0);
     let pound = new CurrencyInfo(POUND_SYMBOL, otherCurrencies['LIBRA ESTERLINA'], 0);
     let cad = new CurrencyInfo(CAD_SYMBOL, otherCurrencies['DOLAR CANADIENSE'], 0);

     let currencies = [dollar, euro, pound, cad];
     prices = new BankPrice('central', dollarPrices['Compra'], dollarPrices['Venta'], otherCurrencies['EURO'], 0, currencies, false);
     
  });
  
  return prices;
}



async function parseImage() {
  const vision = require('@google-cloud/vision');
  const client = new vision.ImageAnnotatorClient();

  let rest = await client.textDetection(path);

  return rest[0].textAnnotations[0].description;
}

async function getMarcosCambioPrices(){
  try
  {
    const pipeline = promisify(stream.pipeline);

    const client = new Twitter({
      subdomain: "api", // "api" is the default (change for other subdomains)
      version: "1.1", // version "1.1" is the default (change for other subdomains)
      consumer_key: process.env.Twitter_consumer_key, // from Twitter.
      consumer_secret: process.env.Twitter_consumer_secret, // from Twitter.
      access_token_key: process.env.Twitter_access_token_key, // from your User (oauth_token)
      access_token_secret: process.env.Twitter_access_secret_token // from your User (oauth_token_secret)
    });
    
    const results = await client.get("statuses/user_timeline", {
      screen_name: "marcoscambioRD",
      exclude_replies: true,
      count: 3
    });

    let textFromImage = "";
    for(let i = 0; i < 3; i++){
      await pipeline(
        got.stream(results[i].extended_entities.media[0].media_url),
        fs.createWriteStream(path)
    );
    
      textFromImage  = await parseImage();
  
      if(textFromImage == undefined) return "";
      let hasDolarIdentifier = textFromImage.indexOf('#Dolares') > 0 && textFromImage.indexOf('Dolares') > 0;
  
      if(hasDolarIdentifier) break;
    }
    
    let text = textFromImage.substr(textFromImage.indexOf('Dolares'), textFromImage.length);
    let paragraphs = text.split('\n');
    const regex = /[\d\.]+/;
    
    let dolarBuy = parseFloat(paragraphs[1].match(regex) || 0);
    let dolarSell = parseFloat(paragraphs[2].match(regex) || 0);
    let euroBuy = parseFloat(paragraphs[3].match(regex) || 0);
    let euroSell = parseFloat(paragraphs[4].match(regex) || 0);
    let francBuy = parseFloat(paragraphs[5].match(regex) || 0);
    let cadString = paragraphs[6];
    let cadBuy = cadString.length <= 14 ? parseFloat(paragraphs[6].match(regex) || 0) : parseFloat(paragraphs[6].substring(10).match(regex) || 0);
    let gbpBuy = parseFloat(paragraphs[7].replace(',','.').match(regex) || 0);
  
    let dollar = new CurrencyInfo(DOLLAR_SYMBOL, dolarBuy, dolarSell);
    let euro = new CurrencyInfo(EURO_SYMBOL, euroBuy, euroSell);
    let cad = new CurrencyInfo(CAD_SYMBOL, cadBuy, 0);
    let gbp = new CurrencyInfo(POUND_SYMBOL, gbpBuy, 0);
    let franc = new CurrencyInfo(FRANC_SYMBOL, francBuy, 0);

    let currencies = [dollar, euro, cad, gbp];

    const prices = new BankPrice('marcoscambio', dolarBuy, dolarSell, euroBuy, euroSell, currencies, false);
    return prices;
  }
  catch(error){
    sentry.captureException(error);
    console.log(error);
    return new BankPrice('marcoscambio', 0,0,0,0,[], true);
  }
}






const getTextContentForPrices = async (page, priceElement) => {
  const price = await page.evaluate(element => element.textContent, priceElement);
  return price;
}

module.exports.initNavigation = initNavigation;