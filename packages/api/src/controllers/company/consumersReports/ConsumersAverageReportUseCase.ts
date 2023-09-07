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

    const companyConsumers = await prisma.consumer.count({
      where: {
        transactions: {
          some: {
            companiesId: companyId,
          },
        },
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

    const cityConsumers = await prisma.consumer.count({
      where: {
        transactions: {
          some: {
            company: {
              companyAddress: {
                cityId,
              },
            },
          },
        },
      },
    })

    const companyAvgBuyPerConsumers = companyTransactions / companyConsumers
    const cityAvgBuyPerConsumers = cityTransactions / cityConsumers

    return {
      company: +companyAvgBuyPerConsumers.toFixed(2),
      city: +cityAvgBuyPerConsumers.toFixed(2),
    }
  }
}
