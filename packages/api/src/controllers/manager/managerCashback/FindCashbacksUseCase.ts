import { DateTime } from 'luxon'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../prisma'

interface Props {
  company?: string
  consumer?: string
  status?: string
  startDate?: string
  endDate?: string
  page?: number
}

const PER_PAGE = 25

class FindCashbacksUseCase {
  async execute({
    company,
    consumer,
    endDate,
    startDate,
    status,
    page = 1,
  }: Props) {
    const where: Prisma.TransactionWhereInput = {
      transactionStatusId: status ? Number(status) : undefined,
      createdAt: {
        gte: startDate ? DateTime.fromISO(startDate).toJSDate() : undefined,
        lte: endDate ? DateTime.fromISO(endDate).toJSDate() : undefined,
      },
      consumer: consumer
        ? {
            OR: [
              { fullName: { contains: consumer, mode: 'insensitive' } },
              { cpf: { startsWith: consumer } },
            ],
          }
        : undefined,
      company: company
        ? {
            OR: [
              { fantasyName: { contains: company, mode: 'insensitive' } },
              { registeredNumber: { startsWith: company } },
            ],
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
        transactionPaymentMethods: {
          select: {
            companyPaymentMethod: {
              select: {
                paymentMethod: {
                  select: {
                    description: true,
                  },
                },
              },
            },
          },
        },
        company: { select: { fantasyName: true } },
        companyUser: { select: { name: true } },
        consumer: { select: { fullName: true } },
        transactionStatus: { select: { description: true } },
      },
      where,
      orderBy: { id: 'desc' },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    })

    const count = await prisma.transaction.count({ where })

    return {
      data: cashbacks,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    }
  }
}

export { FindCashbacksUseCase }
