import * as express from "express";
import { BitcoinPriceController } from "../controller/bitcoinpriceController";
import { authentification } from "../../../services/middleware/authentification";
const Router = express.Router();

Router.get("/", authentification, BitcoinPriceController.getHistory);
export { Router as bitcoinRouter };
