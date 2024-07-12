import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BitcoinPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;

  @Column({ type: "float" })
  purchase_price: number;

  @Column({ type: "float" })
  sell_price: number;
}
