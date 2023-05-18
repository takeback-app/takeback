import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { ColumnNumericTransformer } from "../../config/TransformerDecimal";
import { Companies } from "./Company";
import { RepresentativeBilling } from "./RepresentativeBilling";

@Entity()
export class RepresentativeBillingCompany {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  companyBilling: number;

  @ManyToOne(
    () => RepresentativeBilling,
    (representativeBilling) =>
      representativeBilling.representativeBillingCompany
  )
  representativeBilling: RepresentativeBilling;

  @ManyToOne(() => Companies, (company) => company.representativeBillingCompany)
  company: RepresentativeBilling;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
