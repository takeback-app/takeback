import { prisma } from "../../../prisma";

interface Props {
  companyId: string;
}

class FindCompanyPaymentMethodsUseCase {
  async execute({ companyId }: Props) {
    return prisma.companyPaymentMethod.findMany({
      where: { companyId, paymentMethod: { isTakebackMethod: false } },
      include: { paymentMethod: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

export { FindCompanyPaymentMethodsUseCase };
