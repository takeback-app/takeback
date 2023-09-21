import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'

interface Props {
  companyId: string
}

// billingAmount e cashbackAmount são relativos ao mês em vigência, cashbackToPayAmount e balanceAmount são relativos a todo o tempo.
class BillingReportUseCase {
  async execute({ companyId }: Props) {
    const firstDayMonht = DateTime.now().startOf('month').toJSDate()
    const lastDayMonht = DateTime.now().endOf('month').toJSDate()

    const paidTransactions = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.APPROVED,
              TransactionStatusEnum.PAID_WITH_TAKEBACK,
            ],
          },
        },
        createdAt: { gte: firstDayMonht, lte: lastDayMonht },
      },
      _sum: {
        totalAmount: true,
        cashbackAmount: true,
      },
    })

    const toPayTransactions = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.NOT_PAID,
              TransactionStatusEnum.ON_DELAY,
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.PROCESSING,
            ],
          },
        },
      },
      _sum: {
        takebackFeeAmount: true,
        cashbackAmount: true,
        backAmount: true,
      },
    })

    const { positiveBalance } = await prisma.company.findUniqueOrThrow({
      where: { id: companyId },
    })

    const billingAmount = +paidTransactions._sum.totalAmount
    const cashbackAmount = +paidTransactions._sum.cashbackAmount
    const cashbackToPayAmount =
      +toPayTransactions._sum.cashbackAmount +
      +toPayTransactions._sum.takebackFeeAmount +
      +toPayTransactions._sum.backAmount
    const balanceAmount = +positiveBalance

    return {
      billingAmount,
      cashbackAmount,
      balanceAmount,
      cashbackToPayAmount,
    }
  }
}

export { BillingReportUseCase }
