import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'
import { FindDepositsOrderByColumn } from '../../../requests/reports/manager/consumers/FindDepositsRequest'

interface Props {
  dateStart?: string
  dateEnd?: string
  page: number
  orderByColumn?: string
  order?: 'asc' | 'desc'
  isPaid?: boolean
}

const PER_PAGE = 25

class FindDepositsUseCase {
  async execute({
    dateEnd,
    dateStart,
    order,
    orderByColumn,
    page,
    isPaid,
  }: Props) {
    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).endOf('day').toJSDate()
      : undefined
    const orderByTypes: Prisma.Enumerable<Prisma.DepositOrderByWithRelationInput>[] =
      []
    orderByTypes[FindDepositsOrderByColumn.FULL_NAME] = {
      consumer: {
        fullName: order,
      },
    }
    orderByTypes[FindDepositsOrderByColumn.CREATED_AT] = {
      createdAt: order,
    }
    orderByTypes[FindDepositsOrderByColumn.VALUE] = {
      value: order,
    }
    const pixTransactionsWhere: Prisma.DepositWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      isPaid: isPaid,
    }
    const pixTransactions = await prisma.deposit.findMany({
      where: pixTransactionsWhere,
      select: {
        id: true,
        value: true,
        createdAt: true,
        isPaid: true,
        pix: {
          select: {
            value: true,
          },
        },
        consumer: {
          select: {
            fullName: true,
            consumerAddress: {
              select: {
                city: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: orderByTypes[orderByColumn],
      take: PER_PAGE,
      skip: (Number(page) - 1) * PER_PAGE,
    })

    const count = await prisma.deposit.count({
      where: pixTransactionsWhere,
    })

    return {
      data: pixTransactions,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    }
  }
}

export { FindDepositsUseCase }
