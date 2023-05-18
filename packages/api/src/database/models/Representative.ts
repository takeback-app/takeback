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
import { RepresentativeBilling } from "./RepresentativeBilling";

@Entity()
export class Representative {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  whatsapp: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  gainPercentage: number;

  @Column({
    select: false,
    nullable: true,
  })
  password: string;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @OneToMany(() => Companies, (company) => company.industry)
  companies: Companies[];

  @OneToMany(
    () => RepresentativeBilling,
    (representativeBilling) => representativeBilling.representative
  )
  representativeBilling: RepresentativeBilling[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
