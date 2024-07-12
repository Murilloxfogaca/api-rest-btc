import * as express from "express";
import { WalletBitcoinController } from "../controller/walletBitcoin.controller";
import { authentification } from "../../../services/middleware/authentification";
import { WalletBRLController } from "../controller/walletBRL.controller";
const Router = express.Router();

Router.get(
  "/list/brl",
  authentification,
  WalletBRLController.getListTransferBRL
);
Router.get(
  "/list/bitcoin",
  authentification,
  WalletBitcoinController.getListTransferBTC
);
Router.get(
  "/investment-position",
  authentification,
  WalletBitcoinController.getInvestmentPosition
);
Router.post("/deposit", authentification, WalletBRLController.sendBrl);
Router.get(
  "/volumetry",
  authentification,
  WalletBitcoinController.getVolumetry
);
Router.get("/balance", authentification, WalletBRLController.getBalance);
Router.get(
  "/balance/btc",
  authentification,
  WalletBitcoinController.getBalance
);
Router.get(
  "/quotation",
  authentification,
  WalletBitcoinController.getQuotation
);
Router.post("/btc/buy", authentification, WalletBitcoinController.purchaseBTC);
Router.post("/btc/sold", authentification, WalletBitcoinController.soldBTC);
export { Router as walletRouter };
