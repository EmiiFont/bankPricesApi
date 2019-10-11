'use strict';

const scraper = require('../utils/scraper');

exports.listPrices = function(req, res){
   const asociacionAhorros = new Promise((resolve, reject) => {
    scraper.getAsociacionAhorrosPrices()
       .then(data => {
         resolve(data);
       })
       .catch(err => reject('failed'))
   });

  const bancoCaribe =  new Promise((resolve, reject) => {
    scraper.getBancoCaribePrices()
        .then(data => {
        resolve(data);
        })
        .catch(err => reject('failed'))
    });

    const bancoPromerica =  new Promise((resolve, reject) => {
    scraper.getPromericaPrices()
        .then(data => {
        resolve(data);
        })
        .catch(err => reject('failed'))
    });

    Promise.all([asociacionAhorros, bancoCaribe, bancoPromerica]).then(data => {
        res.send(data);
    }).catch(err => res.status(500).send(err))
}