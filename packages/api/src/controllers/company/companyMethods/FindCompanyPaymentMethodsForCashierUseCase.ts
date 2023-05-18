import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";

interface Props {
  companyId: string;
}

class FindCompanyPaymentMethodsForCashierUseCase {
  async execute({ companyId }: Props) {
    if (!companyId) {
      throw new InternalError("Id da empresa não informado", 400);
    }

    const company = await prisma.company.findUniqueOrThrow({
      where: { id: companyId },
      select: {
        id: true,
        useCashbackAsBack: true,
        companyStatus: { select: { generateCashback: true } },
      },
    });

    const companyPaymentMethods = await prisma.companyPaymentMethod.findMany({
      where: { companyId, paymentMethodId: { not: 1 }, isActive: true },
      select: {
        id: true,
        paymentMethodId: true,
        paymentMethod: {
          select: { description: true },
        },
      },
    });

    const methods = companyPaymentMethods.map((cpm) => ({
      id: cpm.id,
      description: cpm.paymentMethod.description,
      paymentMethodId: cpm.paymentMethodId,
    }));

    return { methods, company };
  }
}

export { FindCompanyPaymentMethodsForCashierUseCase };
