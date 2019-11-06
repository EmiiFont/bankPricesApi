'use strict';

const scraper = require('../utils/scraper');
const bankService = require('../services/bankPricesService');
const infoScraper = require('../utils/infoScraper');
const bankNames = require('../utils/bankNames');

exports.listPrices = function(req, res){

    //infoScraper.getBancoPopularInf();
    //bankService.retrieveBucketfiles();
     bankService.addBankNames(bankNames.bankNames)
    
    //scraper.initNavigation();
   const asociacionAhorros = new Promise((resolve, reject) => {
    scraper.initNavigation()
       .then(data => {
         bankService.addBankPrices(data);
         resolve(data);
       })
       .catch(err => reject('asociacion failed: ' + err))
   });



    asociacionAhorros.then(data => {
        res.send(data);
    }).catch(err => res.status(500).send(err))
}