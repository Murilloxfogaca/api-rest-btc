import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity({ name: "walletbitcoin" })
export class WalletBitcoin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("double precision", { nullable: false })
  amount: number;

  @Column("double precision", { nullable: false })
  value_btc: number;

  @Column({ nullable: false })
  status: string;

  @OneToOne(() => User, (user) => user.WalletBitcoin, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;
  WalletBitcoin: any;
}
