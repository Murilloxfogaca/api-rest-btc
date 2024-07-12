import { WalletBitcoin } from "../../../../config/domain/WalletBitcoin.entity";
import { WalletBRL } from "../../../../config/domain/WalletBRL.entity";
import { AppDataSource } from "../../../../data-source";

export async function transferBRL(amount: number, user, status: string) {
  const walletbrlRepository = AppDataSource.getRepository(WalletBRL);
  const walletBRL = new WalletBRL();
  walletBRL.amount = amount;
  walletBRL.user = user;
  walletBRL.status = status;
  await walletbrlRepository.save(walletBRL);
}

export async function transferBTC(
  amount: number,
  user,
  value_btc,
  status: string
) {
  const walletbitcoinRepository = AppDataSource.getRepository(WalletBitcoin);
  const walletBTC = new WalletBitcoin();
  walletBTC.amount = amount;
  walletBTC.value_btc = value_btc;
  walletBTC.status = status;
  walletBTC.user = user;

  await walletbitcoinRepository.save(walletBTC);
}
