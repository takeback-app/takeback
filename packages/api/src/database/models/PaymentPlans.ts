import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../../config/TransformerDecimal";

import { Companies } from "./Company";
import { CompanyMonthlyPayment } from "./CompanyMonthlyPayment";

@Entity()
export class PaymentPlans {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  takebackBonus: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  value: number;

  @OneToMany(() => Companies, (companies) => companies.paymentPlan)
  company: Companies[];

  @OneToMany(
    () => CompanyMonthlyPayment,
    (monthlyPayment) => monthlyPayment.plan
  )
  companyMonthlyPayment: CompanyMonthlyPayment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
