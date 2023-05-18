import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Consumers } from "./Consumer";

@Entity()
export class RefreshTokens {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  expiresIn: number;

  @OneToOne(() => Consumers)
  @JoinColumn()
  consumer: Consumers;
}
