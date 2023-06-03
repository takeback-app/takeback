import { Bonus, CompanyUser, Consumer } from "@prisma/client";
import { prisma } from "../../../prisma";

export abstract class GenerateBonus {
  abstract create(...args): Promise<Bonus>;

  protected getTransaction(transactionId: number) {
    return prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
      include: {
        company: { select: { paymentPlanId: true, representativeId: true } },
        companyUser: { select: { cpf: true } },
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

  protected getConsumerFromCompanyUser(companyUser?: { cpf: string }) {
    if (!companyUser?.cpf) return null;

    return prisma.consumer.findFirst({
      where: { cpf: companyUser.cpf, isPlaceholderConsumer: false },
    });
  }

  protected updateConsumerBalance(consumer: Consumer, bonus: Bonus) {
    return prisma.consumer.update({
      where: { id: consumer.id },
      data: {
        balance: consumer.balance.add(bonus.value),
      },
    });
  }
}
