import axios from "axios";

export async function getMercadoBitcoin() {
  const mercadobitcoin = await axios.get(
    "https://www.mercadobitcoin.net/api/BTC/ticker/"
  );
  const { data } = mercadobitcoin;
  return data.ticker;
}
