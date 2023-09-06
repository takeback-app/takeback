import { Prisma } from '@prisma/client'
import { Graph, GraphData } from './CosumersReportsController'
import { prisma } from '../../../prisma'
import { InternalError } from '../../../config/GenerateErros'

export abstract class BaseConsumersGraphUseCase {
  async execute(companyId: string): Promise<GraphData> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { companyAddress: { select: { cityId: true } } },
    })

    if (!company) {
      throw new InternalError('Empresa não localizada', 404)
    }

    const companyTransactionWhere: Prisma.TransactionWhereInput = {
      companiesId: companyId,
    }

    const cityTransactionWhere: Prisma.TransactionWhereInput = {
      company: {
        companyAddress: {
          cityId: company.companyAddress.cityId,
        },
      },
    }

    const companyGraphData = await this.getGraphValues(companyTransactionWhere)
    const cityGraphData = await this.getGraphValues(cityTransactionWhere)

    return {
      company: companyGraphData,
      city: cityGraphData,
    }
  }

  abstract getGraphValues(
    customWhere: Prisma.TransactionWhereInput,
    ...args: any[]
  ): Promise<Graph>
}
