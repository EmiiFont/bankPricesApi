'use strict';

const scraper = require('../utils/scraper');

exports.listPrices = function(req, res){
   const asociacionAhorros = new Promise((resolve, reject) => {
    scraper.getAsociacionAhorrosPrices()
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

    Promise.all([asociacionAhorros, bancoCaribe, bancoPromerica, lopezDeHaroPrices, bancoBdiPrices, banescoPrices]).then(data => {
        res.send(data);
    }).catch(err => res.status(500).send(err))
}