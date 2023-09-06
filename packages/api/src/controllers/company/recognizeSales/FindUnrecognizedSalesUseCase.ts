import { DateTime } from 'luxon'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'

interface Props {
  companyId: string
  dateStart: string
  dateEnd: string
  order: 'asc' | 'desc'
  orderByColumn: 'fullName' | 'createdAt'
}

class FindUnrecognizedSalesUseCase {
  async execute({
    companyId,
    dateStart,
    dateEnd,
    order,
    orderByColumn,
  }: Props) {
    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).endOf('day').toJSDate()
      : undefined

    const orderBy: {
      fullName: Prisma.TransactionOrderByWithRelationInput
      createdAt: Prisma.TransactionOrderByWithRelationInput
    } = {
      fullName: {
        consumer: {
          fullName: order,
        },
      },
      createdAt: {
        createdAt: order,
      },
    }

    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        transactionStatus: {
          select: {
            description: true,
          },
        },
        consumer: {
          select: {
            fullName: true,
          },
        },
        companyUser: {
          select: {
            name: true,
          },
        },
        totalAmount: true,
        cashbackAmount: true,
        backAmount: true,
        takebackFeeAmount: true,
        createdAt: true,
      },
      where: {
        companiesId: companyId,
        transactionStatus: {
          description: TransactionStatusEnum.PAID_WITH_TAKEBACK,
        },
        companyUsersId: null,
        createdAt: { lte: endDate, gte: startDate },
      },
      orderBy: orderBy[orderByColumn],
    })

    return transactions
  }
}

export { FindUnrecognizedSalesUseCase }
