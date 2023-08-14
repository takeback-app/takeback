import { BaseGraphUseCase } from './BaseGraphUseCase'
import { prisma } from '../../prisma'

export class StoreValueGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.storeOrder.aggregate({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: {
        value: true,
      },
    })

    return data._sum.value?.toNumber()
  }
}
