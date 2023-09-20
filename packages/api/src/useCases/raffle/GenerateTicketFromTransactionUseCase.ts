import { Decimal } from '@prisma/client/runtime/library'
import { RaffleTicketStatus } from '@prisma/client'
import { GenerateTicketsUseCase } from './GenerateTicketsUseCase'
import { prisma } from '../../prisma'
import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'

interface Transaction {
  id: number
  companiesId: string
  consumersId: string
  totalAmount: number | Decimal
  transactionStatusId: number
}

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
      transactionId: transaction.id,
      status:
        transactionStatus.description ===
        TransactionStatusEnum.PAID_WITH_TAKEBACK
          ? RaffleTicketStatus.ACTIVE
          : RaffleTicketStatus.PENDING,
    })
  }
}
