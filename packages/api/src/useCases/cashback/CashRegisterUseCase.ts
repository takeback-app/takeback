import { TransactionSource } from '@prisma/client'
import { GenerateCashbackUseCase } from './GenerateCashbackUseCase'
import { ValidateUserPasswordUseCase } from '../../controllers/company/companyCashback/ValidateUserPasswordUseCase'
import { prisma } from '../../prisma'
import { PlaceholderConsumer } from '../consumer/CreatePlaceholderConsumer'

interface MethodData {
  id: number
  value: number
}

interface CashRegisterDTO {
  companyId: string
  cpf: string
  totalAmount: number
  companyUserPassword: string
  backAmount: number
  paymentMethods: MethodData[]
}

export class CashRegisterUseCase {
  private validateUserPassword: ValidateUserPasswordUseCase
  private generateCashbackUseCase: GenerateCashbackUseCase

  constructor() {
    this.validateUserPassword = new ValidateUserPasswordUseCase()
    this.generateCashbackUseCase = new GenerateCashbackUseCase()
  }

  async execute(data: CashRegisterDTO) {
    const {
      companyId,
      companyUserPassword,
      cpf,
      paymentMethods,
      totalAmount,
      backAmount,
    } = data

    const { id: companyUserId } =
      await this.validateUserPassword.findCompanyUserByPassword(
        companyId,
        companyUserPassword,
      )

    let consumer = await prisma.consumer.findFirst({
      where: { cpf },
    })

    if (!consumer) {
      consumer = await PlaceholderConsumer.create(cpf)
    }

    return this.generateCashbackUseCase.execute({
      companyId: companyId,
      companyUserId,
      consumerId: consumer.id,
      paymentMethods,
      totalAmount,
      backAmount,
      transactionSource: TransactionSource.CHECKOUT,
    })
  }
}
