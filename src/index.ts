import * as express from "express";
// import * as cron from "node-cron";
// import { addBankPrices } from "./services/bankPricesService";
import * as sentry from "@sentry/node";
import { listPrices } from "./controllers/pricesController";
import * as dotenv from "dotenv";

const port = process.env.PORT || 3000;

dotenv.config();

const app = express();

sentry.init({
  dsn: process.env.SENTRYDSN,
});

console.log(process.env.NODE_ENV);

app.use(sentry.Handlers.requestHandler());

app.route("/prices").get(listPrices);

app.use(sentry.Handlers.errorHandler());

// 0 0 */2 * * * cada dos horas
// 0 17 * * * a las 5
// cron.schedule("0 17 * * *", () => {
//   scraper.initNavigation().then((data) => {
//     addBankPrices(data).then((d) => {
//       sentry.captureMessage("Updated prices succesfully on: " + new Date().toLocaleDateString());
//       console.log("Updated prices succesfully on: " + new Date().toLocaleDateString());
//     });
//   });
// });

app.listen(port, () => console.log(`listening on port ${process.env.PORT}!`));
