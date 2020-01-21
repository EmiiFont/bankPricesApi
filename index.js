const express = require('express')
const app = express()
const cron = require('node-cron')
const port = process.env.PORT || 3000;
const scraper = require('./utils/scraper');
//const bankService = require('../services/bankPricesService');


const routes = require('./routes/pricesRoutes');
routes.routes(app);


cron.schedule("0 0 */5 * * * *", function() {
  scraper.initNavigation()
      .then(data => {
        bankService.addBankPrices(data);
        console.log("Executed succesfully on: " + new Date().toLocaleDateString());
  });
});


app.listen(port, () => console.log(`listening on port ${port}!`))