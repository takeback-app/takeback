import { prisma } from "../../prisma";
import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { GetRepresentative } from "./GetRepresentativeUseCase";

interface Props {
  representativeUserId: string;
}

export class DashboardUseCase {
  async execute({ representativeUserId }: Props) {
    const { whereCondominiumFilter, representativeUser } =
      await GetRepresentative.handle(representativeUserId);

    const commissions = await prisma.commission.aggregate({
      where: { representativeId: representativeUser.representativeId },
      _sum: { value: true },
    });

    const paidTransactions = await prisma.transaction.aggregate({
      where: {
        company: whereCondominiumFilter,
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
        company: whereCondominiumFilter,
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

    const billingAmount = +paidTransactions._sum.totalAmount;
    const cashbackAmount = +paidTransactions._sum.cashbackAmount;
    const cashbackToPayAmount = +toPayTransactions._sum.cashbackAmount;
    const feeToPayAmount = +toPayTransactions._sum.takebackFeeAmount;

    const representative = await prisma.representative.findUnique({
      where: { id: representativeUser.representativeId },
    });

    const companiesBalance = await prisma.company.aggregate({
      where: whereCondominiumFilter,
      _sum: { positiveBalance: true },
    });

    const companyMonthlyPayments = await prisma.companyMonthlyPayment.aggregate(
      {
        where: {
          isPaid: false,
          isForgiven: false,
          company: whereCondominiumFilter,
        },
        _sum: { amountPaid: true },
      }
    );

    const monthlyPaymentToPayAmount = +companyMonthlyPayments._sum.amountPaid;

    return {
      billingAmount,
      commissionsAmount: +commissions._sum.value,
      commissionAmountPending:
        cashbackToPayAmount +
        monthlyPaymentToPayAmount *
          +representativeUser.representative.commissionPercentage,
      cashbackAmount,
      companiesBalance: +companiesBalance._sum.positiveBalance,
      balance: +representative.balance,
      cashbackToPayAmount,
      monthlyPaymentToPayAmount,
      feeToPayAmount,
    };
  }
}
