import { BitcoinPrice } from "../../../config/domain/BitcoinPrice.entity";
import { AppDataSource } from "../../../data-source";

export const saveBitcoinPrices = async (
  purchase_price: number,
  sell_price: number
) => {
  const bitcoinPriceRepository = AppDataSource.getRepository(BitcoinPrice);

  try {
    const newPrice = new BitcoinPrice();
    newPrice.purchase_price = purchase_price;
    newPrice.sell_price = sell_price;

    await bitcoinPriceRepository.save(newPrice);
    console.log(
      `Saved Bitcoin price data: purchase ${purchase_price}, Sell ${sell_price}`
    );
  } catch (error) {
    console.error("Error saving Bitcoin price data:", error.message);
  }
};
