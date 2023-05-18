import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { prisma } from "../../prisma";
import { BaseGraphUseCase } from "./BaseGraphUseCase";

export class FeeGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.transaction.aggregate({
      where: {
        transactionStatus: { description: TransactionStatusEnum.APPROVED },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { takebackFeeAmount: true },
    });

    return +data._sum.takebackFeeAmount;
  }
}
