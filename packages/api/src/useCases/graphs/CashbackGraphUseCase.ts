import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { prisma } from "../../prisma";
import { BaseGraphUseCase } from "./BaseGraphUseCase";

export class CashbackGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.transaction.aggregate({
      where: {
        transactionStatus: { description: TransactionStatusEnum.APPROVED },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { cashbackAmount: true },
    });

    return +data._sum.cashbackAmount;
  }
}
