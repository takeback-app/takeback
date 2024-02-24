import { RaffleTicketStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { prisma } from '../../prisma'

interface MakeData {
  consumerId: string
  purchaseAmount: number
  transactionId: number
}

interface TicketData {
  number: number
  raffleId: string
  transactionId: number
  consumerId: string
  status: RaffleTicketStatus
}

type Raffle = {
  id: string
  companyId: string
  isOpenToEmployees: boolean
  ticketValue: Decimal
  tickets: { number: number }[]
}

export class RaffleTicketCalculator {
  constructor(
    private consumerId: string,
    private purchaseAmount: number,
    private transactionId: number,
  ) {}

  public static make({ consumerId, purchaseAmount, transactionId }: MakeData) {
    return new RaffleTicketCalculator(consumerId, purchaseAmount, transactionId)
  }

  private async verifyConsumerCanGetTickets(raffle: Raffle) {
    if (raffle.isOpenToEmployees) return true

    const consumer = await prisma.consumer.findUnique({
      where: { id: this.consumerId },
    })

    const employee = await prisma.companyUser.findFirst({
      where: {
        company: { transactions: { some: { id: this.transactionId } } },
        cpf: consumer.cpf,
        isActive: true,
      },
    })

    if (!employee) return true

    return false
  }

  public async generateTicketsData(raffle: Raffle, status: RaffleTicketStatus) {
    const canGetTickets = await this.verifyConsumerCanGetTickets(raffle)

    if (!canGetTickets) return []

    const newTicketsQtd = Math.floor(
      this.purchaseAmount / raffle.ticketValue.toNumber(),
    )

    const lastNumber = raffle.tickets[0]?.number || 0

    const tickets: TicketData[] = []

    for (let i = 1; i <= newTicketsQtd; i++) {
      tickets.push({
        consumerId: this.consumerId,
        number: lastNumber + i,
        raffleId: raffle.id,
        transactionId: this.transactionId,
        status,
      })
    }

    return tickets
  }
}
