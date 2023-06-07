import { prisma } from "../../../prisma";
class FindDataToUseInAplicationUseCase {
  async execute() {
    const industries = await prisma.industry.findMany({
      select: {
        id: true,
        description: true,
        industryFee: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    const status = await prisma.companyStatus.findMany({
      select: {
        id: true,
        description: true,
        blocked: true,
      },
      orderBy: {
        description: "asc",
      },
    });

    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        state: true,
        zipCodes: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const plans = await prisma.paymentPlan.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const cashbackStatus = await prisma.transactionStatus.findMany({
      orderBy: {
        description: "asc",
      },
    });

    const offices = await prisma.companyUserType.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return { industries, status, cities, plans, cashbackStatus, offices };
  }
}

export { FindDataToUseInAplicationUseCase };
