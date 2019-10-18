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

    asociacionAhorros.then(data => {
        res.send(data);
    }).catch(err => res.status(500).send(err))
}