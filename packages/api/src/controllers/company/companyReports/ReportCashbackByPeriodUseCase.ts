import { BaseGraphUseCase } from './BaseGraphUseCase'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'

export class ReportCashbackByPeriodUseCase extends BaseGraphUseCase {
  async getMonthlyValue(
    monthStart: Date,
    monthEnd: Date,
    companyId: string,
  ): Promise<number> {
    const data = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.APPROVED,
              TransactionStatusEnum.PAID_WITH_TAKEBACK,
            ],
          },
        },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { cashbackAmount: true },
    })

    return +data._sum.cashbackAmount
  }
}
