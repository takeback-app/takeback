import { Bonus, CompanyUser, Consumer, PaymentPlan } from "@prisma/client";
import { prisma } from "../../../prisma";

export abstract class GenerateBonus {
  protected abstract getValidBonusCalculator(
    paymentPlan: PaymentPlan
  ): number | null;

  abstract create(...args): Promise<Bonus>;

  protected getTransaction(transactionId: number) {
    return prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
      include: {
        company: { include: { paymentPlan: true } },
        companyUser: true,
      },
    });
  }

  protected getConsumerFromCompanyUser(companyUser: CompanyUser) {
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
