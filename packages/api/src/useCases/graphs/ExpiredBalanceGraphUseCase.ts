import { prisma } from "../../prisma";
import { BaseGraphUseCase } from "./BaseGraphUseCase";

export class ExpiredBalanceGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.consumerExpireBalances.aggregate({
      where: {
        expireAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { balance: true },
    });

    return +data._sum.balance;
  }
}
