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
import { Representative } from "./Representative";
import { RepresentativeBillingCompany } from "./RepresentativeBillingCompany";

@Entity()
export class RepresentativeBilling {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  billingValue: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  totalCompaniesBilling: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  representativeFee: number;

  @Column({
    default: false,
  })
  isPaid: boolean;

  @Column({
    type: "date",
    nullable: true,
  })
  paidDate: Date;

  @ManyToOne(
    () => Representative,
    (representative) => representative.representativeBilling
  )
  representative: Representative;

  @OneToMany(
    () => RepresentativeBillingCompany,
    (representativeBillingCompany) =>
      representativeBillingCompany.representativeBilling
  )
  representativeBillingCompany: RepresentativeBillingCompany[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
