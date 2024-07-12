import { Request, Response } from "express";
import { Between } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { WalletBRL } from "../../../config/domain/WalletBRL.entity";
import { formatToBRL, processTransfersBRL } from "../../../helpers/formatters";
import { getUserForID } from "../../user/application/services";
import { getBalanceForId } from "../application/services/utils";
import { transferBRL } from "../application/services/hooks";

export class WalletBRLController {
  static async sendBrl(req: Request, res: Response) {
    try {
      const { amount } = req.body;
      if (amount < 0)
        return res
          .status(422)
          .json({ message: "the deposit must be greater than 0" });

      const user = await getUserForID(req[" currentUser"].id);
      if (!user) return res.status(500).json({ message: "User not found" });
      await transferBRL(amount, user, "purchase");

      return res.status(200).json({
        message: `Deposit in Real was successfully added, in the amount of ${formatToBRL(
          amount
        )}`,
      });
    } catch (error) {}
  }

  static async getListTransferBRL(req: Request, res: Response) {
    const { di, df } = req.query;

    const today = new Date();
    const endDate = typeof df === "string" ? new Date(df) : today;
    const startDate =
      typeof di === "string"
        ? new Date(di)
        : new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

    const walletRepository = AppDataSource.getRepository<WalletBRL>(WalletBRL);
    const wallets = await walletRepository.find({
      where: {
        user: { id: req[" currentUser"].id },
        createdat: Between(startDate, endDate),
      },
      relations: ["user"],
    });
    const totalQuantity = await getBalanceForId(req[" currentUser"].id);

    return res.status(200).json({
      balance: formatToBRL(totalQuantity),
      transfers: processTransfersBRL(wallets),
    });
  }

  static async getBalance(req: Request, res: Response) {
    const totalQuantity = await getBalanceForId(req[" currentUser"].id);
    return res.status(200).json({ balance: formatToBRL(totalQuantity) });
  }
}
