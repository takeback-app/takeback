/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { Graph } from './CosumersReportsController'
import { BaseConsumersGraphUseCase } from './BaseConsumersGraphUseCase'
import { prisma } from '../../../prisma'

export class ChildrensReportUseCase extends BaseConsumersGraphUseCase {
  async getGraphValues(
    customWhere: Prisma.TransactionWhereInput,
  ): Promise<Graph> {
    const consumersWithChildrens = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        hasChildren: true,
      },
    })

    const consumersWithoutChildrens = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        hasChildren: false,
      },
    })

    const allConsumers = consumersWithChildrens + consumersWithoutChildrens
    const withChildrensPercent = +(
      consumersWithChildrens / allConsumers
    ).toFixed(4)
    const withoutChildrensPercent = +(
      consumersWithoutChildrens / allConsumers
    ).toFixed(4)

    return {
      labels: ['Clientes com filhos', 'Clientes sem filhos'],
      values: [withChildrensPercent, withoutChildrensPercent],
    }
  }
}
