import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Companies } from './Company'
import { CompanyMonthlyPayment } from './CompanyMonthlyPayment'
import { ColumnNumericTransformer } from '../../config/TransformerDecimal'

@Entity()
export class PaymentPlans {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  description: string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  takebackBonus: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    default: 0.0,
    transformer: new ColumnNumericTransformer(),
  })
  value: number

  @Column({ default: false })
  canUseIntegration: boolean

  @OneToMany(() => Companies, (companies) => companies.paymentPlan)
  company: Companies[]

  @OneToMany(
    () => CompanyMonthlyPayment,
    (monthlyPayment) => monthlyPayment.plan,
  )
  companyMonthlyPayment: CompanyMonthlyPayment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
