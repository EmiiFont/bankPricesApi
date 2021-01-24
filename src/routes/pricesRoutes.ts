"use strict";
import { listPrices } from "../controllers/pricesController";

export function routes(app) {
  app.route("/prices").get(listPrices);
}
