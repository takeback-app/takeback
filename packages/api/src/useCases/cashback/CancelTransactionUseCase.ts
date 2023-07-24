import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'
import { prisma } from '../../prisma'

interface ExecuteDTO {
  transactionId: number
  cancellationDescription: string
}

export class CancelTransactionUseCase {
  execute(dto: ExecuteDTO) {
    return Promise.all([
      this.cancelTransaction(dto),
      this.cancelTickets(dto.transactionId),
    ])
  }

  private async cancelTransaction({
    cancellationDescription,
    transactionId,
  }: ExecuteDTO) {
    const status = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.CANCELED_BY_PARTNER },
    })

    return prisma.transaction.update({
      where: { id: transactionId },
      data: {
        transactionStatusId: status.id,
        cancellationDescription,
      },
    })
  }

  private async cancelTickets(transactionId: number) {
    return prisma.raffleTicket.updateMany({
      where: { transactionId: transactionId },
      data: { status: 'CANCELED' },
    })
  }
}
