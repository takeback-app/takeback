import { prisma } from "../../../prisma";

class FindPaymentPlanUseCase {
  async execute() {
    return prisma.paymentPlan.findMany({ orderBy: { id: "asc" } });
  }
}

export { FindPaymentPlanUseCase };
