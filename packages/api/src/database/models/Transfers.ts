import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Consumers } from "./Consumer";
import { ColumnNumericTransformer } from "../../config/TransformerDecimal";

@Entity()
export class Transfers {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  value: number;

  @ManyToOne(() => Consumers, (consumers) => consumers.transaction)
  consumerSent: Consumers;

  @ManyToOne(() => Consumers, (consumers) => consumers.transaction)
  consumerReceived: Consumers;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
