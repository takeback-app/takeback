import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'

interface FilterProps {
  statusId?: string
  cashierLimit?: string
}

interface Props {
  companyId: string
  filters?: FilterProps
  page: number
  perPage?: number
  order?: Prisma.SortOrder
}

class FindAllCashbacksUseCase {
  async execute({
    companyId,
    filters,
    page,
    perPage = 20,
    order = 'desc',
  }: Props) {
    const where: Prisma.TransactionWhereInput = {
      transactionStatusId: filters.statusId
        ? Number(filters.statusId)
        : undefined,
      companiesId: companyId,
      createdAt:
        filters.cashierLimit === '1'
          ? {
              gte: DateTime.now().minus({ days: 1 }).toJSDate(),
            }
          : undefined,
    }

    const cashbacks = await prisma.transaction.findMany({
      select: {
        id: true,
        totalAmount: true,
        dateAt: true,
        createdAt: true,
        takebackFeeAmount: true,
        cashbackAmount: true,
        backAmount: true,
        transactionStatusId: true,
        transactionPaymentMethods: {
          select: {
            companyPaymentMethod: {
              select: { paymentMethod: { select: { description: true } } },
            },
          },
        },
        companyUser: { select: { name: true } },
        consumer: { select: { fullName: true } },
        transactionStatus: { select: { description: true } },
      },
      where,
      orderBy: { id: order },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    const total = await prisma.transaction.count({ where })

    return {
      data: cashbacks,
      meta: { lastPage: Math.ceil(total / perPage) },
    }
  }
}

export { FindAllCashbacksUseCase }
