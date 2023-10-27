import { BaseDailyGraphUseCase } from './BaseDailyGraphUseCase'
import { prisma } from '../../prisma'

export class ConsumerDailyGraphUseCase extends BaseDailyGraphUseCase {
  async getDailyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.consumer.count({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    })

    return +data
  }
}
