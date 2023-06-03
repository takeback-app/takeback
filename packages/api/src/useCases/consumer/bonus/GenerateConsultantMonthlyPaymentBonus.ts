import { GenerateBonus } from "./GenerateBonus";

import { prisma } from "../../../prisma";

export class GenerateConsultantMonthlyPaymentBonus extends GenerateBonus {
  async create(monthlyPaymentId: number) {
    const monthlyPayment = await this.getMonthlyPayment(monthlyPaymentId);

    const consumer = await this.getConsumerFromConsultant(
      monthlyPayment.companyId
    );

    if (!consumer) return;

    const consultantBonus = await this.getValidBonusCalculator(
      monthlyPayment.company.representativeId
    );

    if (!consultantBonus) return;

    const baseValue = +monthlyPayment.amountPaid * consultantBonus;
    const value = +baseValue.toFixed(2);

    const bonus = await prisma.bonus.create({
      data: {
        consumerId: consumer.id,
        type: "CONSULTANT",
        value: Math.max(value, 0.01),
      },
    });

    await this.updateConsumerBalance(consumer, bonus);

    return bonus;
  }

  async getValidBonusCalculator(representativeId: string) {
    const representative = await prisma.representative.findUniqueOrThrow({
      where: { id: representativeId },
      select: { consultantBonusPercentage: true },
    });

    const consultantBonusPercentage =
      representative.consultantBonusPercentage.toNumber();

    if (
      !consultantBonusPercentage ||
      consultantBonusPercentage > 1 ||
      consultantBonusPercentage < 0
    ) {
      return null;
    }

    return consultantBonusPercentage;
  }

  async getConsumerFromConsultant(companyId: string) {
    const representativeUserCompany =
      await prisma.representativeUserCompany.findFirst({
        where: { companyId, representativeUser: { isActive: true } },
        include: { representativeUser: { select: { cpf: true } } },
      });

    if (!representativeUserCompany) return null;

    return prisma.consumer.findFirst({
      where: {
        cpf: representativeUserCompany.representativeUser.cpf,
        isPlaceholderConsumer: false,
      },
    });
  }
}
