import { Request, Response } from "express";
import { Between } from "typeorm";
import { User } from "../../../config/domain/User.entity";
import { WalletBitcoin } from "../../../config/domain/WalletBitcoin.entity";
import { AppDataSource } from "../../../data-source";
import {
  adaptDataBTCList,
  processTransfersBTC,
} from "../../../helpers/formatters";
import {
  formatToNumeric10_8,
  formatToNumericReal,
} from "../../../helpers/utils";
import { getMercadoBitcoin } from "../../cron/application/mercadoBitcoin";
import { transferBRL, transferBTC } from "../application/services/hooks";
import {
  getBalanceBTCForId,
  getBalanceForId,
  getResidualBTC,
  validationIsSameBalanceSell,
} from "../application/services/utils";

export class WalletBitcoinController {
  static async getQuotation(req: Request, res: Response) {
    const valuesBTC = await getMercadoBitcoin();
    return res.status(200).json({ buy: valuesBTC.buy, sold: valuesBTC.sold });
  }

  static async getVolumetry(req: Request, res: Response) {
    const userId = req[" currentUser"].id;
    const walletRepository = AppDataSource.getRepository(WalletBitcoin);
    const depoits = await walletRepository
      .createQueryBuilder("walletbitcoin")
      .select("SUM(walletbitcoin.amount)", "totalQuantity")
      .where("walletbitcoin.user.id = :userId", { userId })
      .andWhere("walletbitcoin.status = 'purchase'")
      .andWhere(
        "walletbitcoin.createdat >= CURRENT_DATE AND walletbitcoin.createdat < CURRENT_DATE + INTERVAL '2 days'"
      )
      .getRawOne();

    const sold = await walletRepository
      .createQueryBuilder("walletbitcoin")
      .select("SUM(walletbitcoin.amount)", "totalQuantity")
      .where("walletbitcoin.user.id = :userId", { userId })
      .andWhere("walletbitcoin.status = 'sold'")
      .andWhere(
        "walletbitcoin.createdat >= CURRENT_DATE AND walletbitcoin.createdat < CURRENT_DATE + INTERVAL '2 days'"
      )
      .getRawOne();

    console.log({ depoits: depoits, sold: sold });

    return res.status(200).json({
      purchased: depoits.totalQuantity,
      sold: sold.totalQuantity,
    });
  }

  static async purchaseBTC(req: Request, res: Response) {
    const { amount } = req.body;
    const userId = req[" currentUser"].id;
    const valuesBTC = await getMercadoBitcoin();
    const balance = await getBalanceForId(req[" currentUser"].id);

    if (amount > balance)
      return res.status(500).json({ message: "Insufficient funds." });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) return res.status(500).json({ message: "User not found!" });

    await transferBTC(
      amount / parseFloat(valuesBTC.buy),
      user,
      formatToNumeric10_8(valuesBTC.buy),
      "purchase"
    );

    await transferBRL(amount, user, "sold");

    return res.status(200).json({
      message: `Your bitcoin was successfully purchased, worth ${
        amount / parseFloat(valuesBTC.buy)
      }`,
    });
  }

  static async getBalance(req: Request, res: Response) {
    const totalQuantity = await getBalanceBTCForId(req[" currentUser"].id);
    return res.status(200).json({ balance: totalQuantity });
  }

  static async getInvestmentPosition(req: Request, res: Response) {
    const walletRepository = AppDataSource.getRepository(WalletBitcoin);

    const wallets = await walletRepository.find({
      where: { user: { id: req[" currentUser"].id } },
      relations: ["user"],
    });

    const response = await adaptDataBTCList(wallets);
    return res.status(200).json({ response });
  }

  static async getListTransferBTC(req: Request, res: Response) {
    const { di, df } = req.query;
    const userid = req[" currentUser"].id;
    const today = new Date();
    const endDate = typeof df === "string" ? new Date(df) : today;
    const startDate =
      typeof di === "string"
        ? new Date(di)
        : new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

    const walletRepository = AppDataSource.getRepository(WalletBitcoin);

    const wallets = await walletRepository
      .createQueryBuilder("walletbitcoin")
      .innerJoinAndSelect("walletbitcoin.user", "user")
      .where("walletbitcoin.user.id = :userId", { userId: userid })
      .andWhere(
        `walletbitcoin.createdat BETWEEN '${startDate}' AND '${endDate}'`
      )
      .getMany();

    const totalQuantity = await getBalanceBTCForId(req[" currentUser"].id);

    return res.status(200).json({
      current_balance_btc: totalQuantity,
      transfers: processTransfersBTC(wallets),
    });
  }

  static async soldBTC(req: Request, res: Response) {
    const { amount } = req.body;
    const valuesBTC = await getMercadoBitcoin();
    const userId = req[" currentUser"].id;
    const balance = await getBalanceBTCForId(req[" currentUser"].id);

    if (amount > balance || balance === 0)
      return res
        .status(422)
        .json({ message: `You only have ${balance} bitcoins` });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) return res.status(500).json({ message: "User not found." });

    await transferBRL(
      formatToNumericReal(valuesBTC.sell / amount),
      user,
      "purchase"
    );

    if (validationIsSameBalanceSell(userId)) {
      return res
        .status(200)
        .json({ message: `Bitcoin Successfully Sold in ${amount} Value` });
    }

    await getResidualBTC(userId, amount, user);

    await transferBTC(
      amount,
      user,
      formatToNumeric10_8(valuesBTC.sell),
      "sold"
    );

    return res.status(200).json({
      message: `Bitcoin Successfully Sold in ${amount} Value`,
    });
  }
}
function BetweenDates(
  startDate: Date,
  endDate: Date
): Date | import("typeorm").FindOperator<Date> {
  throw new Error("Function not implemented.");
}
