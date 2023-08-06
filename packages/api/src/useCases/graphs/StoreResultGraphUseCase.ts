import { BaseGraphUseCase } from './BaseGraphUseCase'
import { prisma } from '../../prisma'

export class StoreResultGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.storeOrder.aggregate({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: {
        value: true,
        companyCreditValue: true,
      },
    })

    return data._sum.value?.sub(data._sum.companyCreditValue).toNumber()
  }
}
