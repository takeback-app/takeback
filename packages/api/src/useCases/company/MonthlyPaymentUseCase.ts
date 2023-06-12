import { prisma } from "../../prisma";
import { MonthlyPaymentPaidUseCase } from "../shared/MonthlyPaymentPaidUseCase";

export class MonthlyPaymentUseCase {
  async payMany(ids: number[]) {
    await prisma.companyMonthlyPayment.updateMany({
      where: { id: { in: ids } },
      data: { paymentMade: true },
    });
  }

  async payManyWithTakeback(ids: number[]) {
    const useCase = new MonthlyPaymentPaidUseCase();

    const monthlyPayments = await prisma.companyMonthlyPayment.findMany({
      where: { id: { in: ids } },
    });

    const company = await prisma.company.findUnique({
      where: { id: monthlyPayments[0].companyId },
    });

    let balance = company.positiveBalance.toNumber();

    for (const monthlyPayment of monthlyPayments) {
      const value = monthlyPayment.amountPaid.toNumber();

      if (value > balance) {
        continue;
      }

      await useCase.execute(monthlyPayment.id);

      balance -= value;
    }

    await prisma.company.update({
      where: { id: company.id },
      data: { positiveBalance: balance },
    });
  }
}
