export interface WalletTransfer {
  id: string;
  amount: string;
  value_btc: string;
  status: string;
  createdat: string;
  updatedat: string;
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    createdat: string;
    updatedat: string;
  };
}

export interface InvestmentInfo {
  purchaseDate: Date;
  investedAmount: number;
  btcPriceAtPurchase: number;
  priceVariationPercent: number;
  currentInvestmentValue: number;
}
