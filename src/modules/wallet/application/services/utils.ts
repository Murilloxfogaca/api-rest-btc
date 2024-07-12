import { isNull } from "util";
import { WalletBitcoin } from "../../../../config/domain/WalletBitcoin.entity";
import { WalletBRL } from "../../../../config/domain/WalletBRL.entity";
import { AppDataSource } from "../../../../data-source";
import { formatToNumeric10_8 } from "../../../../helpers/utils";
import { getMercadoBitcoin } from "../../../cron/application/mercadoBitcoin";
import { Between } from "typeorm";
import { format } from "date-fns";

export async function validationIsSameBalanceSell($userID: string) {
  const walletRepository = AppDataSource.getRepository(WalletBitcoin);
  const wallets = await walletRepository.find({
    where: { user: { id: $userID }, status: "purchase" },
    relations: ["user"],
  });

  if (wallets.length === 1 || getBalanceBTCForId($userID)) {
    const walletBTCsold = await walletRepository.findOne({
      where: { id: wallets[0].id },
    });

    walletBTCsold.status = "sold";
    await walletRepository.save(walletBTCsold);
    return true;
  }
  return false;
}

function returnNan(e) {
  return isNaN(e) ? 0 : e;
}

export async function getBalanceForId($userID: string) {
  const userId = $userID;
  const walletRepository = AppDataSource.getRepository(WalletBRL);
  const depoits = await walletRepository
    .createQueryBuilder("wallet")
    .select("SUM(wallet.amount)", "totalQuantity")
    .where("wallet.user.id = :userId", { userId })
    .where("wallet.status = 'purchase'")
    .getRawOne();

  const sold = await walletRepository
    .createQueryBuilder("wallet")
    .select("SUM(wallet.amount)", "totalQuantity")
    .where("wallet.user.id = :userId", { userId })
    .where("wallet.status = 'sold'")
    .getRawOne();

  const totalQuantity =
    returnNan(parseFloat(depoits.totalQuantity)) -
    returnNan(parseFloat(sold.totalQuantity));

  return totalQuantity;
}

export async function getBalanceBTCForId($userID: string) {
  const userId = $userID;
  const walletRepository = AppDataSource.getRepository(WalletBitcoin);
  const depoits = await walletRepository
    .createQueryBuilder("wallet")
    .select("SUM(COALESCE(wallet.amount, 0))", "totalQuantity")
    .where("wallet.user.id = :userId", { userId })
    .andWhere("wallet.status = 'purchase'")
    .getRawOne();

  const totalQuantity = parseFloat(depoits.totalQuantity);

  return isNaN(totalQuantity) || totalQuantity === null ? 0 : totalQuantity;
}

export async function getResidualBTC($userID: string, $amount: number, user) {
  const walletRepository = AppDataSource.getRepository(WalletBitcoin);
  let soldTransfers = [];
  let count: number = 0;
  const valuesBTC = await getMercadoBitcoin();

  const wallets = await walletRepository.find({
    where: { user: { id: $userID }, status: "purchase" },
    relations: ["user"],
  });

  for (const transfer of wallets) {
    count += parseFloat(transfer.amount.toString());
    soldTransfers.push(transfer.id);
    if ($amount < count) {
      break;
    }
  }

  for (const transfersSold of soldTransfers) {
    const walletBTCsold = await walletRepository.findOne({
      where: { id: transfersSold },
    });

    walletBTCsold.status = "sold";
    await walletRepository.save(walletBTCsold);
  }

  const discount = count - $amount;

  if (discount == 0) {
    const walletBTCResidual = new WalletBitcoin();
    walletBTCResidual.amount = discount;
    walletBTCResidual.value_btc = formatToNumeric10_8(valuesBTC.sell);
    walletBTCResidual.status = "purchase";
    walletBTCResidual.user = user;
    await walletRepository.save(walletBTCResidual);
  }

  return { soldTransfers, discount: count - $amount };
}

export const BetweenDates = (from: Date | string, to: Date | string) =>
  Between(
    format(
      typeof from === "string" ? new Date(from) : from,
      "YYYY-MM-DD HH:MM:SS"
    ),
    format(typeof to === "string" ? new Date(to) : to, "YYYY-MM-DD HH:MM:SS")
  );
