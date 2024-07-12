import * as dotenv from "dotenv";
import * as express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./services/middleware/errorHandler";
import { userRouter } from "./modules/user/route/user.routes";
import { walletRouter } from "./modules/wallet/route/wallet.routes";
import {
  scheduleCleanupJob,
  schedulePriceUpdateJob,
} from "./modules/cron/controller/cronJobs";
import { bitcoinRouter } from "./modules/cron/route/bitcoin.routes";
dotenv.config();

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
app.use(errorHandler);
app.use("/", userRouter);
app.use("/history-cron", bitcoinRouter);
app.use("/wallet", walletRouter);
schedulePriceUpdateJob();
scheduleCleanupJob();
app.get("*", (req: Request, res: Response) => {
  res.status(505).json({ message: "Bad Request" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
