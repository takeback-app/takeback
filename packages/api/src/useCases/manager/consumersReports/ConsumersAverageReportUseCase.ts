/* eslint-disable no-unused-vars */
import { InternalError } from '../../../config/GenerateErros'
import { FilterGraph } from '../../../controllers/manager/consumersReports/CosumersReportsController'
import { prisma } from '../../../prisma'

export class ConsumersAverageReportUseCase {
  async execute({ cityId, companyId, stateId }: FilterGraph): Promise<number> {
    const transactions = await prisma.transaction.aggregate({
      where: {
        company: {
          id: companyId,
          companyAddress: {
            cityId,
            city: {
              stateId,
            },
          },
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    })

    const avgBuyPerConsumers =
      +transactions._sum.totalAmount / transactions._count.id

    return +avgBuyPerConsumers.toFixed(2)
  }
}
