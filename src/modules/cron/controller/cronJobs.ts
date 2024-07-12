import * as cron from "node-cron";
import { AppDataSource } from "../../../data-source";
import { BitcoinPrice } from "../../../config/domain/BitcoinPrice.entity";
import { getMercadoBitcoin } from "../application/mercadoBitcoin";
import { saveBitcoinPrices } from "../application/Bitcoinprocess";

export const scheduleCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    const bitcoinPriceRepository = AppDataSource.getRepository(BitcoinPrice);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    try {
      await bitcoinPriceRepository
        .createQueryBuilder()
        .delete()
        .where("timestamp < :ninetyDaysAgo", { ninetyDaysAgo })
        .execute();
      console.log("Data older than 90 days successfully purged.");
    } catch (err) {
      console.error("Error purging old data:", err.message);
    }
  });
};

export const schedulePriceUpdateJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const { buy, sell } = await getMercadoBitcoin();

      await saveBitcoinPrices(buy, sell);
    } catch (error) {
      console.error("Error updating Bitcoin prices:", error.message);
    }
  });
};
