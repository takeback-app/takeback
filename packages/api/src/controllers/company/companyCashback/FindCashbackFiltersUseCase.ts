import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { prisma } from '../../../prisma'
class FindCashbackFiltersUseCase {
  async execute() {
    return await prisma.transactionStatus.findMany({
      where: {
        description: { notIn: [TransactionStatusEnum.PAID_WITH_TAKEBACK] },
      },
    })
  }
}

export { FindCashbackFiltersUseCase }
