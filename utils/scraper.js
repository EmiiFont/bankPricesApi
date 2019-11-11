'use strict';

const puppeteer = require('puppeteer');
const BankPrice = require('../models/bankprice');
const bankNames = require('../utils/bankNames');

const initNavigation = async () => {
    const browser = await puppeteer.launch();
        
   let allPrices = await Promise.all([
        getBanReservasPrices(browser),
        getBancoPopularPrices(browser),
        getBhdLeonPrices(browser),
        getScotiaBankPrices(browser),
        getBancoActivoPrices(browser),
        getBancoBdiPrices(browser), getBancoCaribePrices(browser),
        getBanescoPrices(browser), getPromericaPrices(browser), 
        getLopezDeHaroPrices(browser),
        getCaribeExpressPrices(browser),
        getBancoVimencaPrices(browser),
        getBancoLafise(browser),
        getBancamericaPrices(browser),
        getBancoSantaCruzPrices(browser),
        getAsociacionAhorrosPrices(browser),
        getAsociacionNacionalPrices(browser)
    ]);

    await browser.close();
     
    return allPrices;
}

const getAsociacionAhorrosPrices = async (browser) =>{
   
    let prices = new BankPrice();//{'name': 'asociacion de ahorros y prestamos','dollarBuy': 0, 'dollarSell': 0, 'euroBuy': 0, 'dollarSell': 0};
    
    prices.name = 'asociacionPopular';

    try{
       
        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 937 });

        await page.goto('https://www.apap.com.do/calculadoras/');

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
    }catch(error){
        console.log(error);
    }
     
return prices;
}

const getBancoCaribePrices = async (browser) =>{
    
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 937 });
    await page.goto('https://www.bancocaribe.com.do/divisas');
    
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
    
    const prices = new BankPrice('caribe', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

    return prices;
}

const getPromericaPrices = async (browser) => {
 
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 937 });
    await page.goto('https://www.promerica.com.do/');


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

    const prices = new BankPrice('promerica', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

    return prices;
}

const getLopezDeHaroPrices = async (browser) => {
    
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 937 });
    
    await page.goto('https://www.blh.com.do/');

    await page.waitForSelector('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
   
    const buyElement = await page.$('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
    const sellElement = await page.$('.instance-5 > .vc_column-inner > .wpb_wrapper > .iwithtext > .iwt-text > p');
    
    const text = await page.evaluate(element => element.textContent, buyElement);
    
    const buyPrice = text.substring(26, 31);
    const sellPrice = text.substring(34, 39);
    const euroBuyPrice = text.substring(47, 52);
    const euroSellPrice = text.substring(55, 60);

    const prices = new BankPrice('lopezDeHaro', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

    return prices;
}

const getBancoBdiPrices = async (browser) => {
 const page = await browser.newPage();

 await page.setViewport({ width: 1920, height: 937 });
 await page.goto('https://www.bdi.com.do/');
  
  
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

  const prices = new BankPrice('bdi', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

  return prices;
}

const getBanescoPrices = async (browser) => {
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 937 });

    await page.goto('https://www.banesco.com.do/');
  
  
  await page.waitForSelector('.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)');
  
  const pricesElement = await page.$('.views-element-container > .view-home-tasa-de-cambio > .view-content > .views-row > p:nth-child(3)');
    
  const textBuy = await page.evaluate(element => element.textContent, pricesElement);
  
  const buyPrice = textBuy.substring(12, 17).trim();
  const sellPrice = textBuy.substring(23, 29).trim();
  const euroBuyPrice = textBuy.substring(41, 46).trim();
  const euroSellPrice = textBuy.substring(52, 57).trim();

  const prices = new BankPrice('banesco', buyPrice, sellPrice, euroBuyPrice, euroSellPrice);

  return prices;
}

const getCaribeExpressPrices = async (browser) =>{
    const page = await browser.newPage();

    await page.setViewport({ width: 1920, height: 937 });

    await page.goto('https://caribeexpress.com.do/');
    
    await page.setViewport({ width: 1920, height: 937 });
           
    await page.waitForSelector('#content-wrapper > .container > .plan:nth-child(3) > .plan-price > .value');
    
    let dollarBuyElement = await page.$('#content-wrapper > .container > .plan:nth-child(3) > .plan-price > .value');
    let euroBuyElement = await page.$('#content-wrapper > .container > .plan:nth-child(4) > .plan-price > .value');
    
    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    
    const prices = new BankPrice('caribeExpress', dollarBuyPrice.trim(), 0, euroBuyPrice.trim(), 0);

    return prices;
}

const getBanReservasPrices = async(browser) => {
  const page = await browser.newPage();

  await page.goto('https://www.banreservas.com/');
  
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
  
  const prices = new BankPrice('banreservas', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim());

  return prices;
}

const getBancoPopularPrices = async(browser) => {
  const page = await browser.newPage();

  await page.goto('https://www.popularenlinea.com/personas/Paginas/Home.aspx');
  
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

  const prices = new BankPrice('popular', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim());

  return prices;

}


const getBhdLeonPrices = async(browser) => {
    const page = await browser.newPage();
  
    await page.goto('https://www.bhdleon.com.do')
  
    await page.setViewport({ width: 1920, height: 888 })
    
    await page.waitForSelector('.footer-content-menu > .footer-menu-social > .footer-menu > li:nth-child(5) > .dialog_opener')
    await page.click('.footer-content-menu > .footer-menu-social > .footer-menu > li:nth-child(5) > .dialog_opener')
    
    await page.waitForSelector('#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(2)')
    const dollarBuyElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(2)')
    const dollarSellElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(2) > td:nth-child(3)')
    
    const euroBuyElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(3) > td:nth-child(2)');
    const euroSellElement = await page.$('#TasasDeCambio > table > tbody > tr:nth-child(3) > td:nth-child(3)');
    
    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
    const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);
   
    const prices = new BankPrice('bhdleon', dollarBuyPrice.replace("DOP", "").trim(), dollarSellPrice.replace("DOP", "").trim(), euroBuyPrice.replace("DOP", "").trim(), euroSellPrice.replace("DOP", "").trim());
  
    return prices;
  
  }
const getScotiaBankPrices = async (browser) => {
    const page = await browser.newPage();

  await page.goto('https://do.scotiabank.com/banca-personal/tarifas/tasas-de-cambio.html')
  
  await page.setViewport({ width: 1920, height: 888 })
  
  let frames = await page.frames()
  const frame_3309 = frames.find(f => f.url() === 'https://www4.scotiabank.com/cgi-bin/ratesTool/depdisplay.cgi?pid=80')
  await frame_3309.waitForSelector('#table892 #tb892row2col3cell4320')
 
  const dollarBuyElement = await frame_3309.$('#table892 #tb892row2col3cell4320');
  const dollarSellElement = await frame_3309.$('#table892 #tb892row2col4cell4321');
  
  const euroBuyElement = await frame_3309.$('#table893 #tb893row2col3cell4340');
  const euroSellElement = await frame_3309.$('#table893 #tb893row2col4cell4341');
  
  const dollarBuyPrice = await frame_3309.evaluate(element => element.textContent, dollarBuyElement);
  const dollarSellPrice = await frame_3309.evaluate(element => element.textContent, dollarSellElement);

  const euroBuyPrice = await frame_3309.evaluate(element => element.textContent, euroBuyElement);
  const euroSellPrice = await frame_3309.evaluate(element => element.textContent, euroSellElement);
  
  let eurBuyCal = dollarBuyPrice.trim() * euroBuyPrice.trim();
  let eurSellCal = dollarSellPrice.trim() * euroSellPrice.trim();

  const prices = new BankPrice('scotiaBank', dollarBuyPrice.trim(), dollarSellPrice.trim(), eurBuyCal, eurSellCal);

  return prices;
}

const getBancoActivoPrices = async (browser) =>{
  const page = await browser.newPage();

  await page.goto('https://www.bancoactivo.com.do/tasas-tarifas.html')
  
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
  
  const prices = new BankPrice('activo', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim());

  return prices;
}

const getBancoSantaCruzPrices = async(browser) => {
    
    const page = await browser.newPage();

    await page.goto('https://www.bsc.com.do/dynresources/wj/bsc/v1/divisas');
  
    await page.setViewport({ width: 1920, height: 888 });

    let parsedJson = await page.evaluate(() =>  {
        return JSON.parse(document.querySelector("body").innerText); 
    }); 

    console.log(parsedJson);
    const usd = parsedJson.usd;
    const eur = parsedJson.eur;
    const gbp = parsedJson.gbp;
    const cad = parsedJson.cad;
   
    
    const prices = new BankPrice('santaCruz', usd.precio_compra, usd.precio_venta, eur.precio_compra, eur.precio_venta, gbp.precio_compra, gbp.precio_venta, cad.precio_compra, cad.precio_venta);
    
  return prices;
}

const getBancoVimencaPrices = async(browser) => {
    const page = await browser.newPage();
  
  await page.goto('https://www.bancovimenca.com/');
  
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
  
  const prices = new BankPrice('vimenca', dollarBuyPrice.trim(), dollarSellPrice.trim(), euroBuyPrice.trim(), euroSellPrice.trim());
  
  return prices;
}

const getBancamericaPrices = async(browser) => {
    const page = await browser.newPage();
  
  await page.goto('https://www.bancamerica.com.do/');
  
  await page.setViewport({ width: 1920, height: 888 });
  
  await page.waitForSelector('.contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(4)');
 
 const dollarBuyElement =  await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(4)');
  
 const dollarSellElement =  await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(2) > strong:nth-child(4)');
  
 const euroBuyElement = await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(1) > strong:nth-child(8)');
  
 const euroSellElement = await page.$('.contenedor > .cuadro > .list-inline > li:nth-child(2) > strong:nth-child(8)');
  
 const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
 const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

const euroBuyPrice = await page.evaluate(element => element.textContent, euroBuyElement);
const euroSellPrice = await page.evaluate(element => element.textContent, euroSellElement);
  
  const prices = new BankPrice('bancamerica', dollarBuyPrice.replace("RD$", "").trim(), dollarSellPrice.replace("RD$", "").trim(), euroBuyPrice.replace("RD$", "").trim(), euroSellPrice.replace("RD$", "").trim());

  return prices;
}
 
const getBancoLafise = async(browser) => {
    const page = await browser.newPage();
  
  await page.goto('https://www.lafise.com/blrd');
  
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
  
  const prices = new BankPrice('lafise', dollarBuyPrice.replace("DOP:", "").trim(), dollarSellPrice.replace("USD:", "").trim(), euroBuyPrice.replace("DOP:", "").trim(), euroSellPrice.replace("EUR:", "").trim());
  
  return prices;
}

const getAsociacionNacionalPrices = async(browser) => {

    const page = await browser.newPage();
  
    await page.goto('https://www.alnap.com.do/');
    
    await page.setViewport({ width: 1920, height: 888 });
    
    await page.waitForSelector('.block-content > table > tbody > tr > td:nth-child(3)');
    const dollarBuyElement = await page.$('.block-content > table > tbody > tr > td:nth-child(3)');
    const dollarSellElement = await page.$('.block-content > table > tbody > tr > td:nth-child(4)');
    
    const dollarBuyPrice = await page.evaluate(element => element.textContent, dollarBuyElement);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dollarSellElement);

    const prices = new BankPrice('asociacionNacional', dollarBuyPrice.trim(), dollarSellPrice.trim(), 0, 0);

    return prices;
}


const getTextContentForPrices = async (page, dBuy, dSell, eBuy, eSell) => {
    const dollarBuyPrice = await page.evaluate(element => element.textContent, dBuy);
    const dollarSellPrice = await page.evaluate(element => element.textContent, dSell);
  
    const euroBuyPrice = await page.evaluate(element => element.textContent, eBuy);
    const euroSellPrice = await page.evaluate(element => element.textContent, eSell);

    return {dollarBuyPrice, dollarSellPrice, euroBuyPrice, euroSellPrice}
}

module.exports.initNavigation = initNavigation;