export interface Transfer {
  id: string;
  amount: string;
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

export interface ProcessedTransfer {
  status: string;
  amountBRL: string;
  amountBTC: string;
  formattedDate: string;
}
