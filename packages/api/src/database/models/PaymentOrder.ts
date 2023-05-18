import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../../config/TransformerDecimal";

import { Companies } from "./Company";
import { PaymentOrderMethods } from "./PaymentOrderMethods";
import { PaymentOrderStatus } from "./PaymentOrderStatus";
import { Transactions } from "./Transaction";

@Entity()
export class PaymentOrder {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  value: number;

  @Column({
    nullable: true,
  })
  ticketName: string;

  @Column({
    nullable: true,
  })
  ticketPath: string;

  @Column({
    nullable: true,
  })
  pixKey: string;

  @Column({
    nullable: true,
  })
  approvedAt: Date;

  @ManyToOne(
    () => PaymentOrderStatus,
    (paymentStatus) => paymentStatus.paymentOrder
  )
  status: PaymentOrderStatus;

  @ManyToOne(() => Companies, (companies) => companies.paymentOrder)
  company: Companies;

  @OneToMany(() => Transactions, (transaction) => transaction.paymentOrder)
  transactions: Transactions[];

  @ManyToOne(
    () => PaymentOrderMethods,
    (paymentMethod) => paymentMethod.paymentOrder
  )
  paymentMethod: PaymentOrderMethods;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
