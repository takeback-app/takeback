import { RaffleTicketStatus, Transaction } from '@prisma/client'
import { GenerateTicketsUseCase } from './GenerateTicketsUseCase'
import { prisma } from '../../prisma'
import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'

export class GenerateTicketFromTransactionUseCase {
  async execute(transaction: Transaction) {
    const useCase = new GenerateTicketsUseCase()

    const transactionStatus = await prisma.transactionStatus.findFirstOrThrow({
      where: { id: transaction.transactionStatusId },
    })

    await useCase.execute({
      companyId: transaction.companiesId,
      consumerId: transaction.consumersId,
      purchaseAmount: +transaction.totalAmount,
      transaction: transaction,
      status:
        transactionStatus.description ===
          TransactionStatusEnum.PAID_WITH_TAKEBACK
          ? RaffleTicketStatus.ACTIVE
          : RaffleTicketStatus.PENDING,
    })
  }
}
