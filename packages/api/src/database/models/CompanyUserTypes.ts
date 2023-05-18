import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { CompanyUsers } from "./CompanyUsers";

@Entity()
export class CompanyUserTypes {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    nullable: false,
    default: false,
  })
  isManager: boolean;

  @OneToMany(
    () => CompanyUsers,
    (companyUsers) => companyUsers.companyUserTypes
  )
  users: CompanyUsers[];
}
