import { getMercadoBitcoin } from "../modules/cron/application/mercadoBitcoin";
import { InvestmentInfo } from "../modules/wallet/dto/WalletBitcoin.dto";
import { ProcessedTransfer } from "../modules/wallet/dto/WalletBRL.dto";

export function formatToBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export async function adaptDataBTCList(transfers) {
  const investmentInfo: InvestmentInfo[] = [];
  const currentBtcPrice = await getMercadoBitcoin();

  for (const transfer of transfers) {
    const purchaseDate = new Date(transfer.createdat);
    const investedAmount = transfer.amount;
    const btcPriceAtPurchase = transfer.value_btc;
    const priceVariationPercent =
      ((currentBtcPrice.buy - btcPriceAtPurchase) / btcPriceAtPurchase) * 100;
    const currentInvestmentValue = investedAmount * currentBtcPrice.buy;

    investmentInfo.push({
      purchaseDate,
      investedAmount,
      btcPriceAtPurchase,
      priceVariationPercent,
      currentInvestmentValue,
    });
  }

  return investmentInfo;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function processTransfersBRL(transfers): ProcessedTransfer[] {
  return transfers.map((transfer) => {
    const amountBRL = parseFloat(transfer.amount);

    return {
      status: transfer.status,
      amountBRL: amountBRL.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      formattedDate: formatDate(transfer.createdat),
    };
  });
}

export function processTransfersBTC(transfers): ProcessedTransfer[] {
  return transfers.map((transfer) => {
    const amountBTC = parseFloat(transfer.amount);
    const timeofpurchase = transfer.value_btc;

    return {
      status: transfer.status,
      amountBTC: amountBTC,
      value_at_the_time_of_purchase: timeofpurchase,
      formattedDate: formatDate(transfer.createdat),
    };
  });
}
