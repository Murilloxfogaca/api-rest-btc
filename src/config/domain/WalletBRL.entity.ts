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

@Entity({ name: "walletbrl" })
export class WalletBRL {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("double precision", { nullable: false })
  amount: number;

  @Column({ nullable: false })
  status: string;

  @OneToOne(() => User, (user) => user.walletbrl, { eager: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;
}
