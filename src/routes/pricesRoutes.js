'use strict';
const cacheMiddleware = require('../utils/middleware');


module.exports.routes = function(app){
    var priceCtrl = require('../controllers/pricesController');

    app.use(function (req, res, next) {
        cacheMiddleware(360, req, res, next);
      });

    app.route('/prices')
    .get(priceCtrl.listPrices);
}