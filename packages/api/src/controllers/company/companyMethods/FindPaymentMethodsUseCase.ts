import { prisma } from "../../../prisma";

class FindPaymentMethodsUseCase {
  async execute() {
    return prisma.paymentMethod.findMany({
      where: { isTakebackMethod: false },
    });
  }
}

export { FindPaymentMethodsUseCase };
