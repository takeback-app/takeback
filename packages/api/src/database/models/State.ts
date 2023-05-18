import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { City } from "./City";

@Entity()
export class State {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column()
  initials: string;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];
}
