import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({
    nullable: false,
  })
  payDate: number;

  @Column({
    nullable: true,
  })
  provisionalAccessDays: number;

  @Column({
    nullable: true,
  })
  takebackPixKey: string;

  @Column({
    nullable: true,
  })
  takebackQRCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
