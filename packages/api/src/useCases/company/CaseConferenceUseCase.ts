import { DateTime } from "luxon";
import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { prisma } from "../../prisma";
import { CashConferenceFilterTypeEnum } from "../../requests/CashConferenceRequest";
import { CashConferenceCalculator } from "./CashConferenceCalculator";

interface CaseConferenceUseCaseDto {
  date: string;
  type: CashConferenceFilterTypeEnum;
  companyId: string;
}

export class CaseConferenceUseCase {
  async execute(dto: CaseConferenceUseCaseDto) {
    const { date, type, companyId } = dto;

    const transactionStatus = this.getTransactionStatusFromType(type);

    const transactions = await prisma.transaction.findMany({
      orderBy: { companyUsersId: "asc" },
      where: {
        companiesId: companyId,
        transactionStatus: { description: { in: transactionStatus } },
        companyUsersId: { not: null },
        transactionPaymentMethods: { some: { amount: { gt: 0 } } },
        createdAt: {
          gte: DateTime.fromISO(date).startOf("day").toJSDate(),
          lte: DateTime.fromISO(date).endOf("day").toJSDate(),
        },
      },
      select: {
        id: true,
        totalAmount: true,
        companyUsersId: true,
        transactionPaymentMethods: {
          where: { amount: { gt: 0 } },
          include: {
            companyPaymentMethod: {
              select: {
                paymentMethod: {
                  select: {
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const companyUsers = await prisma.companyUser.findMany({
      where: { companyId },
    });

    return CashConferenceCalculator.make(companyUsers)
      .calculate(transactions)
      .getData();
  }

  private getTransactionStatusFromType(type: CashConferenceFilterTypeEnum) {
    if (type === "approved") {
      return [
        TransactionStatusEnum.APPROVED,
        TransactionStatusEnum.PAID_WITH_TAKEBACK,
      ];
    }

    if (type === "pending") {
      return [
        TransactionStatusEnum.NOT_PAID,
        TransactionStatusEnum.PENDING,
        TransactionStatusEnum.ON_DELAY,
        TransactionStatusEnum.PROCESSING,
      ];
    }

    return [
      TransactionStatusEnum.NOT_PAID,
      TransactionStatusEnum.PENDING,
      TransactionStatusEnum.ON_DELAY,
      TransactionStatusEnum.PROCESSING,
      TransactionStatusEnum.APPROVED,
      TransactionStatusEnum.PAID_WITH_TAKEBACK,
    ];
  }
}
