import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { PaymentOrder } from "./PaymentOrder";

@Entity()
export class PaymentOrderMethods {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @Column({
    default: true,
    nullable: true,
  })
  isActive: boolean;

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.paymentMethod)
  paymentOrder: PaymentOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
