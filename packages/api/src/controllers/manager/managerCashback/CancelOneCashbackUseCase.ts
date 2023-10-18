import { InternalError } from '../../../config/GenerateErros'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { prisma } from '../../../prisma'

export class CancelOneCashbackUseCase {
  async execute(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: Number(transactionId),
      },
      include: {
        transactionStatus: true,
      },
    })

    if (!transaction) {
      throw new InternalError('Cashback não encontrado', 400)
    }

    if (
      transaction.transactionStatus.description !==
      TransactionStatusEnum.PENDING
    ) {
      throw new InternalError('Só é possível cancelar cashbacks pendentes', 400)
    }

    const status = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.CANCELED_BY_CLIENT },
    })

    return prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        transactionStatusId: status.id,
      },
    })
  }
}
