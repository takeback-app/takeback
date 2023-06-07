import { prisma } from "../../prisma";
import { GenerateConsultantMonthlyPaymentBonus } from "../consumer/bonus/GenerateConsultantMonthlyPaymentBonus";
import { GenerateMonthlyPaymentCommission } from "../representative/commission/GenerateMonthlyPaymentCommission";

export class MonthlyPaymentPaidUseCase {
  private consultantBonus: GenerateConsultantMonthlyPaymentBonus;
  private monthlyPaymentCommission: GenerateMonthlyPaymentCommission;

  constructor() {
    this.consultantBonus = new GenerateConsultantMonthlyPaymentBonus();
    this.monthlyPaymentCommission = new GenerateMonthlyPaymentCommission();
  }

  async execute(monthlyPaymentId: number) {
    return Promise.all([
      this.approve(monthlyPaymentId),
      this.consultantBonus.create(monthlyPaymentId),
      this.monthlyPaymentCommission.create(monthlyPaymentId),
    ]);
  }

  private async approve(monthlyPaymentId: number) {
    await prisma.companyMonthlyPayment.update({
      where: { id: monthlyPaymentId },
      data: { isPaid: true, paidDate: new Date() },
    });
  }
}
