import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { WalletBitcoin } from "./WalletBitcoin.entity";
import { WalletBRL } from "./WalletBRL.entity";
@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;

  @OneToOne(() => WalletBRL, (walletbrl) => walletbrl.user)
  walletbrl: WalletBRL;

  @OneToOne(() => WalletBitcoin, (walletbitcoin) => walletbitcoin.user)
  WalletBitcoin: WalletBitcoin;
}
