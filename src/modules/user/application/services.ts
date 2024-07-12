import { User } from "../../../config/domain/User.entity";
import { AppDataSource } from "../../../data-source";

interface TickerData {
  high: string;
  low: string;
  vol: string;
  last: string;
  purchase: string;
  sold: string;
  open: string;
  date: number;
  pair: string;
}

interface APIResponse {
  ticker: TickerData;
}

export async function getUserForID($userID: string) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: $userID },
  });
  return user;
}
