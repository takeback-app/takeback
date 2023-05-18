import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { City } from "./City";

@Entity()
export class ZipCodes {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  zipCode: string;

  @ManyToOne(() => City, (city) => city.zipCode)
  cities: City;
}
