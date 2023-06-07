import { Representative } from "@prisma/client";

import { GenerateCommission } from "./GenerateCommission";

import { prisma } from "../../../prisma";

export class GenerateCashbackCommission extends GenerateCommission {
  async create(transactionId: number) {
    const transaction = await this.getTransaction(transactionId);

    if (!transaction.company.representativeId) return;

    const commissionPercentage = this.getValidCommissionCalculator(
      transaction.company.representative
    );

    if (!commissionPercentage) return;

    const baseValue = +transaction.takebackFeeAmount * commissionPercentage;
    const value = +baseValue.toFixed(2);

    const commission = await prisma.commission.create({
      data: {
        representativeId: transaction.company.representativeId,
        type: "CASHBACK",
        value: Math.max(value, 0.01),
        transactionId: transaction.id,
      },
    });

    await this.updateRepresentativeBalance(
      transaction.company.representative,
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
