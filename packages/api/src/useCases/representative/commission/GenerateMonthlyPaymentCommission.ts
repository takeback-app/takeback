import { Representative } from "@prisma/client";

import { GenerateCommission } from "./GenerateCommission";

import { prisma } from "../../../prisma";

export class GenerateMonthlyPaymentCommission extends GenerateCommission {
  async create(monthlyPaymentId: number) {
    const monthlyPayment = await this.getMonthlyPayment(monthlyPaymentId);

    if (!monthlyPayment.company.representativeId) return;

    const commissionPercentage = this.getValidCommissionCalculator(
      monthlyPayment.company.representative
    );

    if (!commissionPercentage) return;

    const baseValue = +monthlyPayment.amountPaid * commissionPercentage;
    const value = +baseValue.toFixed(2);

    const commission = await prisma.commission.create({
      data: {
        representativeId: monthlyPayment.company.representativeId,
        type: "CASHBACK",
        value: Math.max(value, 0.01),
        companyMonthlyPaymentId: monthlyPayment.id,
      },
    });

    await this.updateRepresentativeBalance(
      monthlyPayment.company.representative,
      commission
    );

    return commission;
  }

  getValidCommissionCalculator(representative: Representative) {
    const commissionPercentage = representative.commissionPercentage.toNumber();

    if (
      !commissionPercentage ||
      commissionPercentage > 1 ||
      commissionPercentage < 0
    ) {
      return null;
    }

    return commissionPercentage;
  }
}
