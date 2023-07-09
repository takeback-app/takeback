import { Transaction, TransactionSolicitation } from '@prisma/client'
import { GenerateCashbackUseCase } from './GenerateCashbackUseCase'
import { prisma } from '../../prisma'

export class ApproveSolicitationUseCase {
  protected generateCashbackUseCase: GenerateCashbackUseCase

  constructor() {
    this.generateCashbackUseCase = new GenerateCashbackUseCase()
  }

  async execute(
    solicitation: TransactionSolicitation,
    companyUserId?: string,
  ): Promise<Transaction> {
    const totalAmount = solicitation.valueInCents / 100

    const paymentMethods = [
      { id: solicitation.companyPaymentMethodId, value: totalAmount },
    ]

    const transaction = await this.generateCashbackUseCase.execute({
      companyId: solicitation.companyId,
      companyUserId,
      consumerId: solicitation.consumerId,
      totalAmount,
      paymentMethods,
    })

    await prisma.transactionSolicitation.update({
      where: { id: solicitation.id },
      data: { status: 'APPROVED', updatedAt: new Date(), companyUserId },
    })

    return transaction
  }
}
