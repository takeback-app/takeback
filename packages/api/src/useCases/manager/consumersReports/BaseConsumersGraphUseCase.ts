import { Prisma } from '@prisma/client'
import {
  FilterGraph,
  Graph,
} from '../../../controllers/manager/consumersReports/CosumersReportsController'

export abstract class BaseConsumersGraphUseCase {
  async execute({ cityId, companyId, stateId }: FilterGraph): Promise<Graph> {
    const transactionWhere: Prisma.TransactionWhereInput = {
      company: {
        id: companyId,
        companyAddress: {
          cityId,
          city: {
            stateId,
          },
        },
      },
    }

    return this.getGraphValues(transactionWhere)
  }

  abstract getGraphValues(
    customWhere: Prisma.TransactionWhereInput,
    ...args: any[]
  ): Promise<Graph>
}
