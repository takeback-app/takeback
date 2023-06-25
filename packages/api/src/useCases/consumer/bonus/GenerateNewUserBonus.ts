import { GenerateBonus } from "./GenerateBonus";

import { prisma } from "../../../prisma";

export class GenerateNewUserBonus extends GenerateBonus {
  async create(transactionId: number) {
    const transaction = await this.getTransaction(transactionId);

    const newUserBonus = await this.getValidBonusCalculator(
      transaction.company.paymentPlanId
    );

    if (!newUserBonus) return;

    const consumer = await this.getConsumerFromCompanyUser(
      transaction.companyUser
    );

    if (!consumer) return;

    const bonus = await prisma.bonus.create({
      data: {
        consumerId: consumer.id,
        type: "NEW_USER",
        value: newUserBonus,
        transactionId: transaction.id,
      },
    });

    await this.updateConsumerBalance(consumer, bonus);

    await this.updateBalanceExpireDate.execute(consumer.id);

    return bonus;
  }

  async getValidBonusCalculator(paymentPlanId: number) {
    const { newUserBonus } = await prisma.paymentPlan.findUniqueOrThrow({
      where: { id: paymentPlanId },
    });

    return newUserBonus.toNumber();
  }
}
