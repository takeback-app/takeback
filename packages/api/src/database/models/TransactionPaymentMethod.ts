import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColumnNumericTransformer } from "../../config/TransformerDecimal";

import { CompanyPaymentMethods } from "./CompanyPaymentMethod";
import { Transactions } from "./Transaction";

@Entity()
export class TransactionPaymentMethods {
  @PrimaryGeneratedColumn("increment")
  public id!: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  public cashbackPercentage!: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  public cashbackValue!: number;

  @ManyToOne(
    () => Transactions,
    (transactions) => transactions.transactionPaymentMethod
  )
  public transactions!: Transactions;

  @ManyToOne(
    () => CompanyPaymentMethods,
    (companyPaymentMethods) => companyPaymentMethods.paymentMethod
  )
  public paymentMethod!: CompanyPaymentMethods;
}
