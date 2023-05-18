import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Companies } from "./Company";
import { CompanyUserTypes } from "./CompanyUserTypes";
import { Transactions } from "./Transaction";

@Entity()
export class CompanyUsers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  cpf: string;

  @Column({
    nullable: false,
    default: false,
  })
  isRootUser: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  password: string;

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

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column({
    nullable: true,
    name: "companyId",
  })
  companyId: string;

  @ManyToOne(() => Companies, (companies) => companies.users)
  company: Companies;

  @ManyToOne(
    () => CompanyUserTypes,
    (companyUserTypes) => companyUserTypes.users
  )
  companyUserTypes: CompanyUserTypes;

  @OneToMany(() => Transactions, (transactions) => transactions.companyUsers)
  transaction: Transactions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
