import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { CompaniesAddress } from "./CompanyAddress";
import { ConsumerAddress } from "./ConsumerAddress";
import { State } from "./State";
import { ZipCodes } from "./ZipCodes";

@Entity()
export class City {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  ibgeCode: string;

  @ManyToOne(() => State, (state) => state.cities)
  state: State;

  @OneToMany(() => ZipCodes, (zipCode) => zipCode.cities)
  zipCode: ZipCodes[];

  @OneToMany(
    () => CompaniesAddress,
    (companiesAddress) => companiesAddress.city
  )
  companiesAdress: CompaniesAddress[];

  @OneToMany(() => ConsumerAddress, (consumerAddress) => consumerAddress.city)
  consumersAddress: ConsumerAddress[];
}
