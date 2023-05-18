import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Representative } from "./Representative";

@Entity()
export class RepresentativeRefreshTokens {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  expiresIn: number;

  @OneToOne(() => Representative)
  @JoinColumn()
  representative: Representative;
}
