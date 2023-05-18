import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { TakeBackUserTypes } from "./TakeBackUserTypes";

@Entity()
export class TakeBackUsers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  cpf: string;

  @Column({
    select: false,
    nullable: true,
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
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  phone: string;

  @ManyToOne(
    () => TakeBackUserTypes,
    (takeBackUserTypes) => takeBackUserTypes.users
  )
  userType: TakeBackUserTypes;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
