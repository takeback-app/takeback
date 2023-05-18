import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentOrder } from "./PaymentOrder";

@Entity()
export class PaymentOrderStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  description: string;

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.status)
  paymentOrder: PaymentOrder[];
}
