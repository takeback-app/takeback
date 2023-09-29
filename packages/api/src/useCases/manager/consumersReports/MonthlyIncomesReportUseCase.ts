/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { BaseConsumersGraphUseCase } from './BaseConsumersGraphUseCase'
import { Graph } from '../../../controllers/manager/consumersReports/CosumersReportsController'
import { prisma } from '../../../prisma'

enum MonthlyIncomesTypes {
  ONE = 'Até R$ 1.000,00',
  BETWEEN_ONE_THREE = 'Entre R$ 1.000,00 e R$ 3.000,00',
  BETWEEN_THREE_FIVE = 'Entre R$ 3.000,00 e R$ 5.000,00',
  ABOVE_FIVE = 'Acima de R$ 5.000,00',
}

export class MonthlyIncomesReportUseCase extends BaseConsumersGraphUseCase {
  async getGraphValues(
    customWhere: Prisma.TransactionWhereInput,
  ): Promise<Graph> {
    const oneThousand = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        monthlyIncome: {
          description: MonthlyIncomesTypes.ONE,
        },
      },
    })

    const betweenOneThreeThousand = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        monthlyIncome: {
          description: MonthlyIncomesTypes.BETWEEN_ONE_THREE,
        },
      },
    })

    const betweenThreeFiveThousand = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        monthlyIncome: {
          description: MonthlyIncomesTypes.BETWEEN_THREE_FIVE,
        },
      },
    })

    const aboveFiveThousand = await prisma.consumer.count({
      where: {
        transactions: {
          some: customWhere,
        },
        monthlyIncome: {
          description: MonthlyIncomesTypes.ABOVE_FIVE,
        },
      },
    })
    const allMonthlyIncomes =
      oneThousand +
      betweenOneThreeThousand +
      betweenThreeFiveThousand +
      aboveFiveThousand
    const oneThousandPercent = +(oneThousand / allMonthlyIncomes).toFixed(4)
    const betweenOneThreeThousandPercent = +(
      betweenOneThreeThousand / allMonthlyIncomes
    ).toFixed(4)
    const betweenThreeFiveThousandPercent = +(
      betweenThreeFiveThousand / allMonthlyIncomes
    ).toFixed(4)
    const aboveFiveThousandPercent = +(
      aboveFiveThousand / allMonthlyIncomes
    ).toFixed(4)

    return {
      labels: [
        'Até R$ 1.000,00',
        'Entre R$ 1.000,00 e R$ 3.000,00',
        'Entre R$ 3.000,00 e R$ 5.000,00',
        'Acima de R$ 5.000,00',
      ],
      values: [
        oneThousandPercent,
        betweenOneThreeThousandPercent,
        betweenThreeFiveThousandPercent,
        aboveFiveThousandPercent,
      ],
    }
  }
}
