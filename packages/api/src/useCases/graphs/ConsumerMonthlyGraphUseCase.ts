import { BaseGraphUseCase } from './BaseGraphUseCase'
import { prisma } from '../../prisma'

export class ConsumerMonthlyGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.consumer.count({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    })

    return +data
  }
}
