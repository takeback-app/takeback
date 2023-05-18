import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { TakeBackUsers } from "./TakeBackUsers";

@Entity()
export class TakeBackUserTypes {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    default: false,
    nullable: false,
  })
  isRoot: boolean;

  @OneToMany(() => TakeBackUsers, (takeBackUsers) => takeBackUsers.userType)
  users: TakeBackUsers[];
}
