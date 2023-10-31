import {
  BaseFinancialGraphUseCase,
  IMonthlyValue,
} from './BaseFinancialGraphUseCase'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'

export class FinancialDataUseCase extends BaseFinancialGraphUseCase {
  async getMonthlyValue(
    monthStart: Date,
    monthEnd: Date,
  ): Promise<IMonthlyValue> {
    const revenuesValue = await this.getRevenuesData(monthStart, monthEnd)
    const expensesValue = await this.getExpensesData(monthStart, monthEnd)

    return { revenuesValue, expensesValue }
  }

  private async getExpensesData(
    monthStart: Date,
    monthEnd: Date,
  ): Promise<number> {
    const bonuses = await prisma.bonus.aggregate({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
      },
      _sum: {
        value: true,
      },
    })

    const commissions = await prisma.commission.aggregate({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
      },
      _sum: {
        value: true,
      },
    })

    const storeOrder = await prisma.storeOrder.aggregate({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
      },
      _sum: {
        companyCreditValue: true,
      },
    })

    return (
      Number(bonuses._sum.value) +
      Number(commissions._sum.value) +
      Number(storeOrder._sum.companyCreditValue)
    )
  }

  private async getRevenuesData(
    monthStart: Date,
    monthEnd: Date,
  ): Promise<number> {
    const transactions = await prisma.transaction.aggregate({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
        transactionStatus: {
          description: TransactionStatusEnum.APPROVED,
        },
      },
      _sum: {
        takebackFeeAmount: true,
      },
    })

    const monthlyPayments = await prisma.companyMonthlyPayment.aggregate({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
        isPaid: true,
      },
      _sum: {
        amountPaid: true,
      },
    })

    const expireBalances = await prisma.consumerExpireBalances.aggregate({
      where: {
        expireAt: {
          lte: monthEnd,
          gte: monthStart,
        },
      },
      _sum: {
        balance: true,
      },
    })

    const storeOrder = await prisma.storeOrder.aggregate({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
      },
      _sum: {
        value: true,
      },
    })

    const deposits = await prisma.deposit.findMany({
      where: {
        createdAt: {
          lte: monthEnd,
          gte: monthStart,
        },
        isPaid: true,
      },
      select: {
        value: true,
        depositFeePercentage: true,
      },
    })

    const depositValues = deposits.reduce(
      (acc, curr) =>
        (acc = acc + Number(curr.value) * Number(curr.depositFeePercentage)),
      0,
    )

    return (
      Number(transactions._sum.takebackFeeAmount) +
      Number(monthlyPayments._sum.amountPaid) +
      Number(expireBalances._sum.balance) +
      depositValues +
      Number(storeOrder._sum.value)
    )
  }
}
