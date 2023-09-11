/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { Graph } from './CosumersReportsController'
import { BaseConsumersGraphUseCase } from './BaseConsumersGraphUseCase'
import { prisma } from '../../../prisma'

enum ConsumerSexTypes {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export class ConsumerSexReportUseCase extends BaseConsumersGraphUseCase {
  async getGraphValues(
    customWhere: Prisma.TransactionWhereInput,
  ): Promise<Graph> {
    const consumersMale = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        sex: ConsumerSexTypes.MALE,
      },
    })

    const consumersFemale = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        sex: ConsumerSexTypes.FEMALE,
      },
    })

    const allConsumers = consumersFemale + consumersMale
    const malePercent = +(consumersMale / allConsumers).toFixed(4)
    const femalePercent = +(consumersFemale / allConsumers).toFixed(4)

    return {
      labels: ['Homens', 'Mulheres'],
      values: [malePercent, femalePercent],
    }
  }
}
