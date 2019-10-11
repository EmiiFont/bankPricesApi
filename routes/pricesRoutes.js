'use strict';

module.exports.routes = function(app){
    var priceCtrl = require('../controllers/pricesController');

    app.route('/prices')
    .get(priceCtrl.listPrices);
}