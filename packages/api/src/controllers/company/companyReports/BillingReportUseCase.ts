import { prisma } from "../../../prisma";
import { TransactionStatusEnum } from "../../../enum/TransactionStatusEnum";

interface Props {
  companyId: string;
}

class BillingReportUseCase {
  async execute({ companyId }: Props) {
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
      },
      _sum: {
        totalAmount: true,
        cashbackAmount: true,
      },
    });

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
    });

    const { positiveBalance } = await prisma.company.findUniqueOrThrow({
      where: { id: companyId },
    });

    const billingAmount = +paidTransactions._sum.totalAmount;
    const cashbackAmount = +paidTransactions._sum.cashbackAmount;
    const cashbackToPayAmount =
      +toPayTransactions._sum.cashbackAmount +
      +toPayTransactions._sum.takebackFeeAmount +
      +toPayTransactions._sum.backAmount;
    const balanceAmount = +positiveBalance;

    return {
      billingAmount,
      cashbackAmount,
      balanceAmount,
      cashbackToPayAmount,
    };
  }
}

export { BillingReportUseCase };
