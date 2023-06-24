import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma";

export class RegisterCompanyDefaultPaymentMethodsUseCase {
  async execute(companyId: string) {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { initialPercentage: { not: null } },
    });

    const companyPaymentMethods: Prisma.CompanyPaymentMethodCreateManyInput[] =
      paymentMethods.map((p) => ({
        companyId,
        paymentMethodId: p.id,
        cashbackPercentage: p.initialPercentage,
        isActive: true,
      }));

    await prisma.companyPaymentMethod.createMany({
      data: companyPaymentMethods,
    });
  }
}
