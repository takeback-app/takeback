import { prisma } from "../../prisma";
import { BaseGraphUseCase } from "./BaseGraphUseCase";

export class BonusGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(monthStart: Date, monthEnd: Date): Promise<number> {
    const data = await prisma.bonus.aggregate({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { value: true },
    });

    return +data._sum.value;
  }
}
