import { Prisma } from '@prisma/client'
import { prisma } from '../../../prisma'
interface Props {
  companyId: string
  order?: Prisma.SortOrder
}

class FindPendingCashbacksUseCase {
  async execute({ companyId, order = 'asc' }: Props) {
    const monthlyPayments = await prisma.companyMonthlyPayment.findMany({
      where: {
        companyId,
        isPaid: false,
        isForgiven: false,
        paymentMade: false,
      },
    })

    const monthlyTransaction = monthlyPayments.map((m) => ({
      id: `Mensalidade - ${m.id}`,
      totalAmount: 0,
      dateAt: m.dueDate,
      createdAt: m.createdAt,
      takebackFeeAmount: m.amountPaid,
      cashbackAmount: 0,
      backAmount: 0,
      consumer: { fullName: 'Mensalidade' },
      transactionPaymentMethods: [],
      transactionStatus: { description: 'Pendente' },
      companyUser: { name: '-' },
    }))

    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        totalAmount: true,
        dateAt: true,
        createdAt: true,
        takebackFeeAmount: true,
        cashbackAmount: true,
        backAmount: true,
        consumer: { select: { fullName: true } },
        transactionStatus: { select: { description: true } },
        companyUser: { select: { name: true } },
        nfceValidationStatus: true,
        nfce: true,
        transactionPaymentMethods: {
          select: {
            companyPaymentMethod: {
              select: { paymentMethod: { select: { description: true } } },
            },
          },
        },
      },
      where: {
        companiesId: companyId,
        transactionStatus: { description: { in: ['Pendente', 'Em atraso'] } },
      },
      orderBy: { id: order },
    })

    return transactions
      .concat(monthlyTransaction as any)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }
}

export { FindPendingCashbacksUseCase }
