import { Raffle as PrismaRaffle, RaffleItem, Prisma } from '@prisma/client'
import crypto from 'node:crypto'
import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'
import { Notify, WinnerRaffle } from '../../notifications'

type Raffle = PrismaRaffle & {
  items: RaffleItem[]
  company: { fantasyName: string }
}

export class DrawRaffleUseCase {
  async execute(raffle: Raffle) {
    const validTicketsFilter: Prisma.RaffleTicketWhereInput = {
      raffleId: raffle.id,
      status: 'ACTIVE',
      consumer: { isPlaceholderConsumer: false },
    }

    let numberOfRemainTickets = await prisma.raffleTicket.count({
      where: validTicketsFilter,
    })

    if (numberOfRemainTickets < raffle.items.length) {
      throw new InternalError(
        'Não é possível sortear sem ter cupons suficientes para o número de prêmios.',
        400,
      )
    }

    for (const item of raffle.items) {
      const drawnTicket = await prisma.raffleTicket.findFirst({
        where: validTicketsFilter,
        orderBy: { number: 'asc' },
        skip: this.randomNumber(numberOfRemainTickets),
      })

      if (!drawnTicket) return

      await prisma.raffleItem.update({
        where: { id: item.id },
        data: { winnerTicketId: drawnTicket.id },
      })

      await prisma.raffleTicket.update({
        where: { id: drawnTicket.id },
        data: { status: 'FINISHED' },
      })

      Notify.send(
        drawnTicket.consumerId,
        new WinnerRaffle(item, raffle.company.fantasyName),
      )

      numberOfRemainTickets--
    }

    await prisma.raffleTicket.updateMany({
      where: { raffleId: raffle.id, status: { not: 'CANCELED' } },
      data: { status: 'FINISHED' },
    })
  }

  randomNumber(max: number) {
    if (max <= 1) return undefined

    return crypto.randomInt(max - 1)
  }
}
