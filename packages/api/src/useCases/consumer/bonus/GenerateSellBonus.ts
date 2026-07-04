import { GenerateBonus } from "./GenerateBonus";

import { prisma } from "../../../prisma";
import { Notify } from "../../../notifications";
import { SellBonusNotification } from "../../../notifications/SellBonusNotification";

export class GenerateSellBonus extends GenerateBonus {
  async create(transactionId: number) {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.totalAmount.toNumber() < 10) return;

    const takebackBonus = await this.getValidBonusCalculator(
      transaction.company.paymentPlanId
    );

    if (!takebackBonus) return;

    const consumer = await this.getConsumerFromCompanyUser(
      transaction.companyUser
    );

    if (!consumer) return;

    const baseValue = +transaction.takebackFeeAmount * takebackBonus;
    const value = +baseValue.toFixed(2);

    const bonus = await prisma.bonus.create({
      data: {
        consumerId: consumer.id,
        type: "SELL",
        value: Math.max(value, 0.01),
        transactionId: transaction.id,
      },
    });

    await this.updateConsumerBalance(consumer, bonus);

    await this.updateBalanceExpireDate.execute(consumer.id);

    Notify.send(consumer.id, new SellBonusNotification(bonus));

    return bonus;
  }

  async getValidBonusCalculator(paymentPlanId: number) {
    const paymentPlan = await prisma.paymentPlan.findUniqueOrThrow({
      where: { id: paymentPlanId },
      select: { takebackBonus: true },
    });

    const takebackBonus = paymentPlan.takebackBonus.toNumber();

    if (!takebackBonus || takebackBonus > 1 || takebackBonus < 0) {
      return null;
    }

    return takebackBonus;
  }
}
