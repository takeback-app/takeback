/* eslint-disable no-unused-vars */
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

interface ConsumersAverageResponse {
  company: number
  city: number
}

export class ConsumersAverageReportUseCase {
  async execute(companyId: string): Promise<ConsumersAverageResponse> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { companyAddress: { select: { cityId: true } } },
    })

    if (!company) {
      throw new InternalError('Empresa não localizada', 404)
    }

    const cityId = company.companyAddress.cityId

    const companyTransactions = await prisma.transaction.count({
      where: {
        companiesId: companyId,
      },
    })

    const companyTransactionsAmount = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
      },
      _sum: {
        totalAmount: true,
      },
    })

    const cityTransactions = await prisma.transaction.count({
      where: {
        company: {
          companyAddress: {
            cityId,
          },
        },
      },
    })

    const cityTransactionsAmount = await prisma.transaction.aggregate({
      where: {
        company: {
          companyAddress: {
            cityId,
          },
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    console.log(
      companyTransactionsAmount._sum,
      companyTransactions,
      cityTransactionsAmount._sum,
      cityTransactions,
    )

    const companyAvgBuyPerConsumers =
      +companyTransactionsAmount._sum.totalAmount / companyTransactions
    const cityAvgBuyPerConsumers =
      +cityTransactionsAmount._sum.totalAmount / cityTransactions

    return {
      company: +companyAvgBuyPerConsumers.toFixed(2),
      city: +cityAvgBuyPerConsumers.toFixed(2),
    }
  }
}
