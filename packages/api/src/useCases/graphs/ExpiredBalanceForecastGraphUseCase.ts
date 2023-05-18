import { prisma } from "../../prisma";
import { BaseGraphUseCase } from "./BaseGraphUseCase";

export class ExpiredBalanceForecastGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.consumer.aggregate({
      where: {
        expireBalanceDate: { gte: monthStart, lt: monthEnd },
      },
      _sum: { balance: true },
    });

    return +data._sum.balance;
  }
}
