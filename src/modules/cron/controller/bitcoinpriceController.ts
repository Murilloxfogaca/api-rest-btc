import { Request, Response } from "express";
import { BitcoinPrice } from "../../../config/domain/BitcoinPrice.entity";
import { AppDataSource } from "../../../data-source";

export class BitcoinPriceController {
  static async getHistory(req: Request, res: Response) {
    const bitcoinPriceRepository = AppDataSource.getRepository(BitcoinPrice);

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);

      const prices = await bitcoinPriceRepository
        .createQueryBuilder("bitcoin_price")
        .select([
          "bitcoin_price.timestamp",
          "bitcoin_price.purchase_price",
          "bitcoin_price.sell_price",
        ])
        .where("bitcoin_price.timestamp >= :startDate", { startDate })
        .andWhere("bitcoin_price.timestamp <= :endDate", { endDate })
        .andWhere("(EXTRACT(MINUTE FROM bitcoin_price.timestamp) % 10) = 0")
        .orderBy("bitcoin_price.timestamp", "ASC")
        .getRawMany();

      res.status(200).json(prices);
    } catch (err) {
      res.status(500).json({
        message: "Error getting Bitcoin price history",
        error: err.message,
      });
    }
  }
}
