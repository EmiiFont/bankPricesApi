const express = require('express')
const app = express()
const cron = require('node-cron')
const port = process.env.PORT || 3000;
const scraper = require('./utils/scraper');
const bankService = require('./services/bankPricesService');
const sentry = require('@sentry/node')
require('dotenv').config();


sentry.init({
  dsn: process.env.SENTRYDSN
})

app.use(sentry.Handlers.requestHandler());

const routes = require('./routes/pricesRoutes');

routes.routes(app);

app.use(sentry.Handlers.errorHandler());


cron.schedule("0 17 * * *", function() {
  scraper.initNavigation()
      .then(data => {
        bankService.addBankPrices(data);
        sentry.captureMessage("Updated prices succesfully on: " + new Date().toLocaleDateString());
        console.log("Updated prices succesfully on: " + new Date().toLocaleDateString());
  });
});


app.listen(port, () => console.log(`listening on port ${process.env.PORT}!`))