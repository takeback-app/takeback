import { DateTime } from 'luxon'
import { Prisma } from '@prisma/client'
import { FindPaymentOrderProps } from '../requests/FindPaymentOrderRequest'
import { prisma } from '../../../../prisma'
import { filterNumber } from '../../../../utils'

class FindPaymentOrdersUseCase {
  async execute(filters: FindPaymentOrderProps) {
    const page = filterNumber(filters.page)
    const limit = filterNumber(filters.limit)
    const statusId = filterNumber(filters.statusId)
    const paymentMethodId = filterNumber(filters.paymentMethodId)
    const startDate = DateTime.fromISO(filters.startDate)
      .startOf('day')
      .toString()
    const endDate = DateTime.fromISO(filters.endDate).endOf('day').toString()

    const where: Prisma.PaymentOrderWhereInput = {
      statusId,
      paymentMethodId,
      companyId: filters.companyId,
      createdAt: { lte: endDate, gte: startDate },
    }

    const paymentOrder = await prisma.paymentOrder.findMany({
      select: {
        id: true,
        value: true,
        createdAt: true,
        approvedAt: true,
        ticketName: true,
        ticketPath: true,
        pixKey: true,
        company: {
          select: {
            id: true,
            fantasyName: true,
            email: true,
          },
        },
        paymentOrderStatus: {
          select: {
            description: true,
          },
        },
        paymentOrderMethod: {
          select: {
            id: true,
            description: true,
          },
        },
      },
      where,
      orderBy: { id: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.paymentOrder.count({ where })

    return {
      data: paymentOrder,
      meta: { lastPage: Math.ceil(total / limit) },
    }
  }
}

export { FindPaymentOrdersUseCase }
