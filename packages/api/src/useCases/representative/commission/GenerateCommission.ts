import { Commission, Representative } from "@prisma/client";
import { prisma } from "../../../prisma";

export abstract class GenerateCommission {
  protected abstract getValidCommissionCalculator(
    representative: Representative
  ): number | null;

  abstract create(...args): Promise<Commission>;

  protected getTransaction(transactionId: number) {
    return prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
      include: {
        company: { include: { representative: true } },
        companyUser: true,
      },
    });
  }

  protected getMonthlyPayment(monthlyPaymentId: number) {
    return prisma.companyMonthlyPayment.findUniqueOrThrow({
      where: { id: monthlyPaymentId },
      include: {
        company: { include: { representative: true } },
      },
    });
  }

  protected updateRepresentativeBalance(
    representative: Representative,
    commission: Commission
  ) {
    return prisma.representative.update({
      where: { id: representative.id },
      data: {
        balance: representative.balance.add(commission.value),
      },
    });
  }
}
