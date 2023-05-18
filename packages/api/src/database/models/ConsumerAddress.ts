import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { City } from "./City";

@Entity()
export class ConsumerAddress {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: true,
  })
  street: string;

  @Column({
    nullable: true,
  })
  district: string;

  @Column({
    nullable: true,
  })
  number: string;

  @Column({
    nullable: true,
  })
  complement: string;

  @Column({
    nullable: true,
  })
  zipCode: string;

  @ManyToOne(() => City, (city) => city.consumersAddress)
  city: City;
}
