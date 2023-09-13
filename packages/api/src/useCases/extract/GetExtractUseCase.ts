import {
  BonusType,
  QRCodeType,
  SolicitationStatus,
  SolicitationType,
} from '@prisma/client'
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import { prisma } from '../../prisma'
import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'

interface TransactionData {
  id: number
  companyName: string
  status: string
  cashbackAmount: number
  backAmount: number
  amountPayWithTakebackBalance: number
}

interface TransferData {
  id: number
  consumerName: string
  isReceived: boolean
  amount: number
}

interface BonusData {
  id: string
  amount: number
  type: BonusType
}

interface BalanceExpirationData {
  id: string
  amount: number
}

interface SolicitationData {
  id: string
  amount: number
  companyName: string
  type: SolicitationType
  status: SolicitationStatus
  text?: string
}

interface StoreOrderData {
  id: string
  value: number
  quantity: number
  companyName: string
  productName: string
}

interface QRCodeData {
  id: string
  description: string
  companyName: string
  type: QRCodeType
}

type ExtractItemType =
  | { type: 'TRANSACTION'; data: TransactionData }
  | { type: 'TRANSFER'; data: TransferData }
  | { type: 'BALANCE_EXPIRATION'; data: BalanceExpirationData }
  | { type: 'BONUS'; data: BonusData }
  | { type: 'SOLICITATION'; data: SolicitationData }
  | { type: 'STORE_ORDER'; data: StoreOrderData }
  | { type: 'QRCODE'; data: QRCodeData }

type ExtractItem = ExtractItemType & {
  id: string
  referenceDate: Date
}

export class GetExtractUseCase {
  private startPageDate?: Date
  private month?: DateTime
  private endPageDate?: Date

  constructor(private consumerId: string, page: number = 0) {
    if (!page) return

    this.month = DateTime.now()
      .minus({ months: page - 1 })
      .setLocale('pt-br')

    this.startPageDate = DateTime.now()
      .minus({ months: page - 1 })
      .startOf('month')
      .toJSDate()
    this.endPageDate = DateTime.now()
      .minus({ months: page - 1 })
      .endOf('month')
      .toJSDate()
  }

  getMonthName() {
    if (!this.month) return

    const isSameYear = this.month.hasSame(DateTime.now(), 'year')

    const monthName = isSameYear
      ? this.month.toFormat('MMMM')
      : this.month.toFormat('MMMM - yyyy')

    return monthName[0].toUpperCase() + monthName.slice(1)
  }

  async execute(): Promise<ExtractItem[]> {
    const transactions = await this.transactions()
    const transfers = await this.transfers()
    const balanceExpirations = await this.balanceExpirations()
    const bonuses = await this.bonuses()
    const solicitations = await this.solicitations()
    const storeOrders = await this.storeOrders()
    const qrCodes = await this.qrCodes()

    return transactions
      .concat(
        transfers,
        balanceExpirations,
        bonuses,
        solicitations,
        storeOrders,
        qrCodes,
      )
      .sort((a, b) => b.referenceDate.getTime() - a.referenceDate.getTime())
  }

  async transactions(): Promise<ExtractItem[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        consumersId: this.consumerId,
        transactionStatus: {
          description: { notIn: [TransactionStatusEnum.WAITING] },
        },
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
      select: {
        id: true,
        cashbackAmount: true,
        amountPayWithTakebackBalance: true,
        backAmount: true,
        createdAt: true,
        transactionStatus: { select: { description: true } },
        company: { select: { fantasyName: true } },
      },
    })

    return transactions.map((t) => ({
      id: randomUUID(),
      type: 'TRANSACTION',
      data: {
        id: t.id,
        cashbackAmount: +t.cashbackAmount,
        amountPayWithTakebackBalance: +t.amountPayWithTakebackBalance,
        backAmount: +t.backAmount,
        companyName: t.company?.fantasyName ?? '-',
        status: t.transactionStatus.description,
      },
      referenceDate: t.createdAt,
    }))
  }

  async transfers(): Promise<ExtractItem[]> {
    const transfers = await prisma.transfer.findMany({
      where: {
        OR: [
          { consumerSentId: this.consumerId },
          { consumerReceivedId: this.consumerId },
        ],
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
      select: {
        id: true,
        consumerReceivedId: true,
        createdAt: true,
        value: true,
        senderConsumer: { select: { fullName: true } },
        receiverConsumer: { select: { fullName: true } },
      },
    })

    return transfers.map((t) => ({
      id: randomUUID(),
      type: 'TRANSFER',
      data: {
        id: t.id,
        amount: +t.value,
        isReceived: t.consumerReceivedId === this.consumerId,
        consumerName:
          t.consumerReceivedId === this.consumerId
            ? t.senderConsumer.fullName
            : t.receiverConsumer.fullName,
      },
      referenceDate: t.createdAt,
    }))
  }

  async balanceExpirations(): Promise<ExtractItem[]> {
    const balanceExpirations = await prisma.consumerExpireBalances.findMany({
      where: {
        consumerId: this.consumerId,
        expireAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
    })

    return balanceExpirations.map((t) => ({
      id: randomUUID(),
      type: 'BALANCE_EXPIRATION',
      data: {
        id: t.id,
        amount: +t.balance,
      },
      referenceDate: t.expireAt,
    }))
  }

  async bonuses(): Promise<ExtractItem[]> {
    const bonuses = await prisma.bonus.findMany({
      where: {
        consumerId: this.consumerId,
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
    })

    return bonuses.map((b) => ({
      id: randomUUID(),
      type: 'BONUS',
      data: {
        id: b.id,
        amount: b.value,
        type: b.type,
      },
      referenceDate: b.createdAt,
    }))
  }

  async solicitations(): Promise<ExtractItem[]> {
    const solicitations = await prisma.transactionSolicitation.findMany({
      where: {
        consumerId: this.consumerId,
        status: { not: 'APPROVED' },
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
      include: {
        company: { select: { fantasyName: true } },
        companyPaymentMethod: { select: { cashbackPercentage: true } },
      },
    })

    return solicitations.map((s) => {
      const amount =
        s.type === 'CASHBACK'
          ? s.valueInCents * +s.companyPaymentMethod.cashbackPercentage
          : s.valueInCents

      return {
        id: s.id,
        type: 'SOLICITATION',
        data: {
          id: s.id,
          amount: amount / 100,
          companyName: s.company.fantasyName,
          status: s.status,
          type: s.type,
          text: s.text,
        },
        referenceDate: s.createdAt,
      }
    })
  }

  async storeOrders(): Promise<ExtractItem[]> {
    const storeOrders = await prisma.storeOrder.findMany({
      where: {
        consumerId: this.consumerId,
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
      include: {
        product: {
          select: {
            name: true,
            company: { select: { fantasyName: true } },
          },
        },
      },
    })

    return storeOrders.map((s) => {
      return {
        id: s.id,
        type: 'STORE_ORDER',
        data: {
          id: s.id,
          value: s.value.toNumber(),
          quantity: s.quantity,
          companyName: s.product.company.fantasyName,
          productName: s.product.name,
        },
        referenceDate: s.createdAt,
      }
    })
  }

  async qrCodes(): Promise<ExtractItem[]> {
    const qRCodes = await prisma.qRCode.findMany({
      where: {
        consumerId: this.consumerId,
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
        type: { not: 'VALIDATED' },
      },
      select: {
        id: true,
        description: true,
        type: true,
        createdAt: true,
        company: { select: { fantasyName: true } },
      },
    })

    return qRCodes.map((q) => {
      return {
        id: q.id,
        type: 'QRCODE',
        data: {
          id: q.id,
          description: q.description,
          companyName: q.company.fantasyName,
          type: q.type,
        },
        referenceDate: q.createdAt,
      }
    })
  }
}
