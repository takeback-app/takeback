import { GenerateBonus } from "./GenerateBonus";

import { prisma } from "../../../prisma";

export class GenerateConsultantBonus extends GenerateBonus {
  async create(transactionId: number) {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.totalAmount.toNumber() <= 10) return;

    const consumer = await this.getConsumerFromConsultant(
      transaction.companiesId
    );

    if (!consumer) return;

    const consultantBonus = await this.getValidBonusCalculator(
      transaction.company.representativeId
    );

    if (!consultantBonus) return;

    const baseValue = +transaction.takebackFeeAmount * consultantBonus;
    const value = +baseValue.toFixed(2);

    const bonus = await prisma.bonus.create({
      data: {
        consumerId: consumer.id,
        type: "CONSULTANT",
        value: Math.max(value, 0.01),
        transactionId: transaction.id,
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
