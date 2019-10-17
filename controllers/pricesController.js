'use strict';

const scraper = require('../utils/scraper');

exports.listPrices = function(req, res){

    //scraper.initNavigation();
   const asociacionAhorros = new Promise((resolve, reject) => {
    scraper.initNavigation()
       .then(data => {
         resolve(data);
       })
       .catch(err => reject('asociacion failed: ' + err))
   });

  const bancoCaribe =  new Promise((resolve, reject) => {
    scraper.getBancoCaribePrices()
        .then(data => {
        resolve(data);
        })
        .catch(err => reject('banco caribe failed: ' + err))
    });

    const bancoPromerica =  new Promise((resolve, reject) => {
    scraper.getPromericaPrices()
        .then(data => {
        resolve(data);
        })
        .catch(err => reject('promerica failed: ' + err))
    });

    const lopezDeHaroPrices =  new Promise((resolve, reject) => {
        scraper.getLopezDeHaroPrices()
            .then(data => {
            resolve(data);
            })
            .catch(err => reject('Lopez de haro failed: ' + err))
        });
    
    const bancoBdiPrices =  new Promise((resolve, reject) => {
        scraper.getBancoBdiPrices()
            .then(data => {
            resolve(data);
            })
            .catch(err => reject('banco bdi failed: ' + err))
        });    

    const banescoPrices =  new Promise((resolve, reject) => {
        scraper.getBanescoPrices()
            .then(data => {
            resolve(data);
            })
            .catch(err => reject('banesco failed: ' + err))
        });  

    const caribePrices =  new Promise((resolve, reject) => {
        scraper.getCaribeExpressPrices()
            .then(data => {
            resolve(data);
            })
            .catch(err => reject('caribe express failed: ' + err))
        });  

    Promise.all([asociacionAhorros, bancoCaribe, bancoPromerica, lopezDeHaroPrices, bancoBdiPrices, banescoPrices, caribePrices]).then(data => {
        res.send(data);
    }).catch(err => res.status(500).send(err))
}