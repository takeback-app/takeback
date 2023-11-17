import { DateTime } from 'luxon'
import { Prisma } from '@prisma/client'
import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'
import { prisma } from '../../prisma'
import { CompanyStatusEnum } from '../../enum/CompanyStatusEnum'
import { GeneratePaymentOrderUseCase } from '../../controllers/company/companyPaymentOrder/GeneratePaymentOrderUseCase'

export class ExpireTransactionsUseCase {
  protected generatePaymentOrderUseCase: GeneratePaymentOrderUseCase

  constructor() {
    this.generatePaymentOrderUseCase = new GeneratePaymentOrderUseCase()
  }

  async execute() {
    const dateLimit = DateTime.now()
      .minus({ days: 10 })
      .startOf('day')
      .toJSDate()

    const companyStatus = await prisma.companyStatus.findFirst({
      where: { description: CompanyStatusEnum.CASHBACK_DEFAULTER },
    })

    const transactionFilter: Prisma.TransactionWhereInput = {
      createdAt: { lte: dateLimit },
      transactionStatus: {
        description: {
          in: [TransactionStatusEnum.PENDING, TransactionStatusEnum.PROCESSING],
        },
      },
    }

    const companies = await prisma.company.findMany({
      where: {
        statusId: { not: companyStatus.id },
        positiveBalance: { gt: 0 },
        transactions: { some: transactionFilter },
      },
      include: {
        transactions: {
          where: transactionFilter,
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    for (const company of companies) {
      let transactionToPayValue = 0

      const transactionIDs = []

      for (const transaction of company.transactions) {
        transactionToPayValue +=
          +transaction.cashbackAmount +
          +transaction.takebackFeeAmount +
          +transaction.backAmount

        if (transactionToPayValue > +company.positiveBalance) {
          break
        }

        const hasPaymentOrder = await prisma.paymentOrder.count({
          where: {
            transactions: {
              some: {
                id: transaction.id,
              },
            },
          },
        })

        if (hasPaymentOrder) {
          continue
        }

        transactionIDs.push(transaction.id)
      }

      if (!transactionIDs.length) {
        continue
      }

      await this.generatePaymentOrderUseCase.generatePaymentOrderWithTakebackBalance(
        {
          companyId: company.id,
          paymentMethodId: 1,
          transactionIDs,
        },
      )
    }

    const transactionStatus = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.ON_DELAY },
    })

    await prisma.company.updateMany({
      where: {
        statusId: { not: companyStatus.id },
        transactions: { some: transactionFilter },
      },
      data: { statusId: companyStatus.id },
    })

    await prisma.transaction.updateMany({
      where: transactionFilter,
      data: { transactionStatusId: transactionStatus.id },
    })
  }
}
