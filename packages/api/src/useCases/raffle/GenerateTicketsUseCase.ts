import {
  Company as PrismaCompany,
  RaffleTicketStatus,
  Transaction,
} from '@prisma/client'

import { DateTime } from 'luxon'
import { RaffleTicketCalculator } from './RaffleTicketCalculator'
import { prisma } from '../../prisma'
import { RaffleStatusEnum } from '../../enum/RaffleStatusEnum'

interface Props {
  companyId: string
  consumerId: string
  purchaseAmount: number
  transaction: Transaction
  status: RaffleTicketStatus
}

type Company = PrismaCompany & {
  companyAddress: {
    cityId: number
  }
}

export class GenerateTicketsUseCase {
  async execute({
    companyId,
    consumerId,
    purchaseAmount,
    transaction,
    status,
  }: Props) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        companyAddress: { select: { cityId: true } },
      },
    })

    const raffles = await this.getRaffles(company, purchaseAmount, transaction)

    const ticketsCalculator = RaffleTicketCalculator.make({
      consumerId,
      purchaseAmount,
      transactionId: transaction.id,
    })

    for (const raffle of raffles) {
      await prisma.raffleTicket.createMany({
        data: await ticketsCalculator.generateTicketsData(raffle, status),
      })
    }

    return raffles
  }

  private getRaffles(
    company: Company,
    purchaseAmount: number,
    transaction: Transaction,
  ) {
    return prisma.raffle.findMany({
      include: {
        tickets: {
          take: 1,
          select: { number: true },
          orderBy: { number: 'desc' },
        },
      },
      where: {
        AND: [
          {
            createdAt: {
              lte: DateTime.fromJSDate(transaction.createdAt)
                .startOf('day')
                .toJSDate(),
            },
            status: { description: RaffleStatusEnum.APPROVED },
            ticketValue: { lte: purchaseAmount },
            drawDate: { gte: DateTime.now().startOf('day').toJSDate() },
          },
          {
            OR: [
              { companyId: company.id },
              {
                openToCompanyRaffles: {
                  some: {
                    companyId: company.id,
                  },
                },
              },
            ],
          },
        ],
      },
    })
  }
}
