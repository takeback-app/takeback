import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ColumnNumericTransformer } from "../../config/TransformerDecimal";

import { ConsumerAddress } from "./ConsumerAddress";
import { Transactions } from "./Transaction";
import { Transfers } from "./Transfers";

@Entity()
export class Consumers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  birthDate: Date;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    select: false,
  })
  signature: string;

  @Column({
    default: false,
  })
  signatureRegistered: boolean;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  blockedBalance: number;

  @Column({
    default: false,
  })
  emailConfirmated: boolean;

  @Column({
    default: false,
  })
  phoneConfirmated: boolean;

  @Column({
    nullable: true,
  })
  codeToConfirmEmail: string;

  @Column({
    default: false,
  })
  deactivedAccount: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  resetPasswordToken: string;

  @Column({
    type: "date",
    nullable: true,
    select: false,
  })
  resetPasswordTokenExpiresDate: Date;

  @OneToOne(() => ConsumerAddress)
  @JoinColumn()
  address: ConsumerAddress;

  @OneToMany(() => Transactions, (transactions) => transactions.consumers)
  transaction: Transactions[];

  @OneToMany(() => Transfers, (transfer) => transfer.consumerSent)
  sentTransfers: Transfers[];

  @OneToMany(() => Transfers, (transfer) => transfer.consumerReceived)
  receivedTransfers: Transfers[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
