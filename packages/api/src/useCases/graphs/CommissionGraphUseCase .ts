import { prisma } from "../../prisma";
import { BaseGraphUseCase } from "./BaseGraphUseCase";

export class CommissionGraphUseCase extends BaseGraphUseCase {
  async getMonthlyValue(
    monthStart: Date,
    monthEnd: Date,
    representativeId: string
  ): Promise<number> {
    const data = await prisma.commission.aggregate({
      where: {
        representativeId,
        createdAt: { gte: monthStart, lt: monthEnd },
      },
      _sum: { value: true },
    });

    return +data._sum.value;
  }
}
