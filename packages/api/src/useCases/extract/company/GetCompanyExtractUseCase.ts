/* eslint-disable no-unused-vars */
/* import { BonusType, SolicitationStatus, SolicitationType } from '@prisma/client' */
import { DateTime } from 'luxon'
import { randomUUID } from 'crypto'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { InternalError } from '../../../config/GenerateErros'

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
  consumerFullName: string
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

interface FilterPeriod {
  value: string
  text: string
}

interface Totalizer {
  currentBalance: number
  endPeriodBalance: number
  startPeriodBalance: number
}

enum PaymentOrderMethodsType {
  TAKEBACK_BALANCE = 'Saldo Takeback',
  PIX = 'PIX',
  BOLETO = 'Boleto',
}

enum PaymentOrderStatusEnum {
  REQUESTED_PAYMENT = 'Pagamento solicitado',
  CANCELED = 'Cancelada',
  AUTHORIZED = 'Autorizada',
  WAITING_CONFIRMATION = 'Aguardando confirmacao',
}

enum WithdrawOrderStatusEnum {
  REQUESTED_WITHDRAW = 'Saque solicitado',
  PAID = 'Pago',
  CANCELED = 'Cancelado',
}

export class GetCompanyExtractUseCase {
  private startPageDate?: Date
  private endPageDate?: Date

  constructor(
    private companyId: string,
    private date: DateTime = DateTime.now(),
  ) {
    if (!date) return

    this.startPageDate = date.startOf('month').toJSDate()

    this.endPageDate = date.endOf('month').toJSDate()
  }

  async execute(): Promise<ExtractItem[]> {
    const paymentOrders = await this.paymentOrders()
    const storeOrders = await this.storeOrders()
    const transactionsFullBalancePaid = await this.transactionsFullBalancePaid()
    const withdrawOrders = await this.withdrawOrders()
    const transactionsPartialBalancePaid =
      await this.transactionsPartialBalancePaid()

    return paymentOrders
      .concat(
        storeOrders,
        transactionsFullBalancePaid,
        withdrawOrders,
        transactionsPartialBalancePaid,
      )
      .sort((a, b) => a.referenceDate.getTime() - b.referenceDate.getTime())
  }

  async getFilterPeriod(): Promise<FilterPeriod[]> {
    // Busca a company e sua data de criação
    const data = await prisma.company.findUnique({
      where: {
        id: this.companyId,
      },
      select: {
        createdAt: true,
      },
    })

    if (!data) {
      throw new InternalError('Empresa não encontrada', 400)
    }

    // Calcula o ano de criação e o ano atual
    const createdAtYear = DateTime.fromJSDate(data.createdAt).year
    const currentYear = DateTime.now().year

    // Cria um array de anos usando Array.from
    const yearDiff = currentYear - createdAtYear + 1
    const years = Array.from({ length: yearDiff }, (_, index) => {
      const year = currentYear - index
      return {
        text: String(year),
        value: String(year),
      }
    })

    return years
  }

  async getTotalizer(): Promise<Totalizer> {
    // final do mês atual
    const currentEndMonthDate = DateTime.now().endOf('month').toJSDate()
    // final do mês selecionado
    const endPeriodDate = this.date.endOf('month').toJSDate()
    // final do mês anterior ao selecionado
    const startPeriodDate = this.date
      .minus({ months: 1 })
      .endOf('month')
      .toJSDate()
    const currentBalance = await this.aggregateTotalizers(currentEndMonthDate)
    const endPeriodBalance = await this.aggregateTotalizers(endPeriodDate)
    const startPeriodBalance = await this.aggregateTotalizers(startPeriodDate)

    return { currentBalance, endPeriodBalance, startPeriodBalance }
  }

  private async aggregateTotalizers(referenceDate: Date): Promise<number> {
    const paymentOrdersTotalizer = await prisma.paymentOrder.aggregate({
      where: {
        companyId: this.companyId,
        createdAt: { lte: referenceDate },
        paymentOrderMethod: {
          description: PaymentOrderMethodsType.TAKEBACK_BALANCE,
        },
        paymentOrderStatus: {
          description: PaymentOrderStatusEnum.AUTHORIZED,
        },
      },
      _sum: {
        value: true,
      },
    })

    const storeOrdersTotalizer = await prisma.storeOrder.aggregate({
      where: {
        product: {
          companyId: this.companyId,
        },
        withdrawalAt: {
          not: null,
          lte: referenceDate,
        },
      },
      _sum: {
        value: true,
      },
    })

    const transactionsFullBalancePaidTotalizer =
      await prisma.transaction.aggregate({
        where: {
          companiesId: this.companyId,
          transactionStatus: {
            description: TransactionStatusEnum.PAID_WITH_TAKEBACK,
          },
          createdAt: { lte: referenceDate },
        },
        _sum: {
          totalAmount: true,
        },
      })

    const transactionsPartialBalancePaidTotalizer =
      await prisma.transaction.aggregate({
        where: {
          companiesId: this.companyId,
          transactionStatus: {
            description: TransactionStatusEnum.APPROVED,
          },
          createdAt: { lte: referenceDate },
          amountPayWithTakebackBalance: { gt: 0 },
        },
        _sum: {
          amountPayWithTakebackBalance: true,
        },
      })

    const withdrawOrdersTotalizer = await prisma.withdrawOrder.aggregate({
      where: {
        companyId: this.companyId,
        createdAt: { lte: referenceDate },
        status: {
          description: WithdrawOrderStatusEnum.PAID,
        },
      },
      _sum: {
        value: true,
      },
    })

    // Ainda não há diferenciação de pagamento por takeback e outros no banco
    /* const monthlyPayments = await prisma.companyMonthlyPayment.aggregate({
      where: {
        companyId: this.companyId,
        createdAt: { lte: referenceDate },
        isPaid: true,
      },
      _sum: {
        amountPaid: true,
      },
    }) */

    // Soma tudo que adiciona ao positiveBalance e subtrai o que retira
    const totalizer =
      Number(storeOrdersTotalizer._sum.value) +
      Number(transactionsFullBalancePaidTotalizer._sum.totalAmount) +
      Number(
        transactionsPartialBalancePaidTotalizer._sum
          .amountPayWithTakebackBalance,
      ) -
      Number(paymentOrdersTotalizer._sum.value) -
      Number(withdrawOrdersTotalizer._sum.value)

    return totalizer
  }

  private async paymentOrders(): Promise<ExtractItem[]> {
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
  private async monthlyPayments(): Promise<ExtractItem[]> {
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

  private async storeOrders(): Promise<ExtractItem[]> {
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

  private async transactionsFullBalancePaid(): Promise<ExtractItem[]> {
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
        consumer: {
          select: {
            fullName: true,
          },
        },
      },
    })

    return transactions.map((t) => ({
      id: randomUUID(),
      type: 'TRANSACTION',
      data: {
        id: t.id,
        totalAmount: +t.totalAmount,
        consumerFullName: t.consumer.fullName,
      },
      referenceDate: t.createdAt,
    }))
  }

  // Anteriormete era possível um consumer pagar com parte saldo takeback e parte outro método, é necessário essa query para pegar o residual dessa antiga regra de negócio
  private async transactionsPartialBalancePaid(): Promise<ExtractItem[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        companiesId: this.companyId,
        transactionStatus: {
          description: TransactionStatusEnum.APPROVED,
        },
        createdAt: { gte: this.startPageDate, lte: this.endPageDate },
        amountPayWithTakebackBalance: { gt: 0 },
      },
      select: {
        id: true,
        amountPayWithTakebackBalance: true,
        createdAt: true,
        consumer: {
          select: {
            fullName: true,
          },
        },
      },
    })

    return transactions.map((t) => ({
      id: randomUUID(),
      type: 'TRANSACTION',
      data: {
        id: t.id,
        totalAmount: +t.amountPayWithTakebackBalance,
        consumerFullName: t.consumer.fullName,
      },
      referenceDate: t.createdAt,
    }))
  }

  private async withdrawOrders(): Promise<ExtractItem[]> {
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
