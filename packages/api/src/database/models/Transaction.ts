import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { TransactionStatus } from "./TransactionStatus";
import { Consumers } from "./Consumer";
import { Companies } from "./Company";
import { CompanyUsers } from "./CompanyUsers";
import { TransactionPaymentMethods } from "./TransactionPaymentMethod";
import { PaymentOrder } from "./PaymentOrder";
import { ColumnNumericTransformer } from "../../config/TransformerDecimal";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  fatherTransactionId?: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  totalAmount: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  amountPayWithOthersMethods: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  amountPayWithTakebackBalance: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  takebackFeePercent: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  takebackFeeAmount: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  cashbackPercent: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  cashbackAmount: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  backAmount: number;

  @Column({
    nullable: true,
  })
  keyTransaction: number;

  @Column({
    nullable: true,
    length: 180,
  })
  cancellationDescription: string;

  @ManyToOne(
    () => TransactionStatus,
    (transactionStatus) => transactionStatus.transaction
  )
  transactionStatus: TransactionStatus;

  @ManyToOne(() => Consumers, (consumers) => consumers.transaction)
  consumers: Consumers;

  @ManyToOne(() => Companies, (companies) => companies.transaction)
  companies: Companies;

  @ManyToOne(() => PaymentOrder, (payment) => payment.transactions)
  paymentOrder: PaymentOrder;

  @ManyToOne(() => CompanyUsers, (companyUsers) => companyUsers.transaction)
  companyUsers: CompanyUsers;

  @OneToMany(
    () => TransactionPaymentMethods,
    (transactionPaymentMethods) => transactionPaymentMethods.transactions
  )
  public transactionPaymentMethod!: TransactionPaymentMethods[];

  @Column({
    type: "date",
    nullable: true,
  })
  dateAt: Date;

  @Column({
    type: "date",
    nullable: true,
  })
  aprovedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
