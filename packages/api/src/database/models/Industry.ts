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

@Entity()
export class Industries {
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
  industryFee: number;

  @OneToMany(() => Companies, (company) => company.industry)
  companies: Companies[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
