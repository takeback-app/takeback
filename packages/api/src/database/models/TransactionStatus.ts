import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Transactions } from "./Transaction";

@Entity()
export class TransactionStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  blocked: boolean;

  @OneToMany(
    () => Transactions,
    (transactions) => transactions.transactionStatus
  )
  transaction: Transactions[];
}
