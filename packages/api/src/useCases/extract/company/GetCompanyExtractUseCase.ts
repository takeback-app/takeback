/* eslint-disable no-unused-vars */
/* import { BonusType, SolicitationStatus, SolicitationType } from '@prisma/client' */
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'

interface PaymentOrdersData {
  id: number
  value: number
  paymentOrderStatus: string
}

interface MonthlyPaymentsData {
  id: number
  amountPaid: number
}

interface StoreOrderData {
  id: string
  companyCreditValue: number
  quantity: number
  productName: string
}

interface TransactionData {
  id: number
  totalAmount: number
}

interface WithdrawOrderData {
  id: string
  value: number
  status: string
}

type ExtractItemType =
  | { type: 'PAYMENT_ORDERS'; data: PaymentOrdersData }
  | { type: 'MONTHLY_PAYMENTS'; data: MonthlyPaymentsData }
  | { type: 'STORE_ORDER'; data: StoreOrderData }
  | { type: 'TRANSACTION'; data: TransactionData }
  | { type: 'WITHDRAW_ORDER'; data: WithdrawOrderData }

type ExtractItem = ExtractItemType & {
  id: string
  referenceDate: Date
}

enum PaymentOrderMethodsType {
  TAKEBACK_BALANCE = 'Saldo Takeback',
  PIX = 'PIX',
  BOLETO = 'Boleto',
}

export class GetCompanyExtractUseCase {
  private startPageDate?: Date
  private month?: DateTime
  private endPageDate?: Date

  constructor(private companyId: string, page: number = 0) {
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
    const paymentOrders = await this.paymentOrders()
    const storeOrders = await this.storeOrders()
    const transactions = await this.transactions()
    const withdrawOrders = await this.withdrawOrders()

    return paymentOrders
      .concat(storeOrders, transactions, withdrawOrders)
      .sort((a, b) => b.referenceDate.getTime() - a.referenceDate.getTime())
  }

  async paymentOrders(): Promise<ExtractItem[]> {
    const paymentOrders = await prisma.paymentOrder.findMany({
      where: {
        companyId: this.companyId,
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
        paymentOrderMethod: {
          description: PaymentOrderMethodsType.TAKEBACK_BALANCE,
        },
      },
      select: {
        id: true,
        value: true,
        createdAt: true,
        paymentOrderStatus: { select: { description: true } },
      },
    })

    return paymentOrders.map((paymentOrder) => ({
      id: randomUUID(),
      type: 'PAYMENT_ORDERS',
      data: {
        id: paymentOrder.id,
        value: +paymentOrder.value,
        paymentOrderStatus: paymentOrder.paymentOrderStatus.description ?? '-',
      },
      referenceDate: paymentOrder.createdAt,
    }))
  }

  // Ainda não há diferenciação de pagamento por takeback e outros no banco
  /* 
  async monthlyPayments(): Promise<ExtractItem[]> {
    const monthlyPayments = await prisma.companyMonthlyPayment.findMany({
      where: {
        companyId: this.companyId,
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
        isPaid: true,
      },
      select: {
        id: true,
        amountPaid: true,
        createdAt: true,
      },
    })

    return monthlyPayments.map((monthlyPayment) => ({
      id: randomUUID(),
      type: 'MONTHLY_PAYMENTS',
      data: {
        id: monthlyPayment.id,
        amountPaid: +monthlyPayment.amountPaid,
      },
      referenceDate: monthlyPayment.createdAt,
    }))
  }
 */

  async storeOrders(): Promise<ExtractItem[]> {
    const storeOrders = await prisma.storeOrder.findMany({
      where: {
        product: {
          companyId: this.companyId,
        },
        withdrawalAt: {
          not: null,
          gte: this.startPageDate,
          lte: this.endPageDate,
        },
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    })

    return storeOrders.map((storeOrder) => {
      return {
        id: storeOrder.id,
        type: 'STORE_ORDER',
        data: {
          id: storeOrder.id,
          companyCreditValue: +storeOrder.companyCreditValue,
          quantity: +storeOrder.quantity,
          productName: storeOrder.product.name,
        },
        referenceDate: storeOrder.withdrawalAt,
      }
    })
  }

  async transactions(): Promise<ExtractItem[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        companiesId: this.companyId,
        transactionStatus: {
          description: TransactionStatusEnum.PAID_WITH_TAKEBACK,
        },
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
      select: {
        id: true,
        totalAmount: true,
        createdAt: true,
      },
    })

    return transactions.map((t) => ({
      id: randomUUID(),
      type: 'TRANSACTION',
      data: {
        id: t.id,
        totalAmount: +t.totalAmount,
      },
      referenceDate: t.createdAt,
    }))
  }

  async withdrawOrders(): Promise<ExtractItem[]> {
    const withdrawOrders = await prisma.withdrawOrder.findMany({
      where: {
        companyId: this.companyId,
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
      },
      select: {
        id: true,
        value: true,
        createdAt: true,
        status: { select: { description: true } },
      },
    })

    return withdrawOrders.map((withdrawOrder) => ({
      id: randomUUID(),
      type: 'WITHDRAW_ORDER',
      data: {
        id: withdrawOrder.id,
        value: +withdrawOrder.value,
        status: withdrawOrder.status.description,
      },
      referenceDate: withdrawOrder.createdAt,
    }))
  }
}
