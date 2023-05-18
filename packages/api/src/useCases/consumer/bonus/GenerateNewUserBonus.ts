import { PaymentPlan } from "@prisma/client";

import { GenerateBonus } from "./GenerateBonus";

import { prisma } from "../../../prisma";

export class GenerateNewUserBonus extends GenerateBonus {
  async create(transactionId: number) {
    const transaction = await this.getTransaction(transactionId);

    const newUserBonus = this.getValidBonusCalculator(
      transaction.company.paymentPlan
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

    return bonus;
  }

  getValidBonusCalculator(paymentPlan: PaymentPlan) {
    return paymentPlan.newUserBonus.toNumber();
  }
}
