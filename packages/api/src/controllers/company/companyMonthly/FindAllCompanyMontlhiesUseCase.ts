import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { PaymentPlans } from "../../../database/models/PaymentPlans";

class FindAllCompanyMontlhiesUseCase {
  async execute(companyId: string) {
    const companyData = await getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.periodFree",
        "company.currentMonthlyPaymentPaid",
        "company.provisionalAccessAllowedAt",
        "company.firstAccessAllowedAt",
        "paymentPlan.description",
        "paymentPlan.value",
        "status.description",
      ])
      .leftJoin(
        PaymentPlans,
        "paymentPlan",
        "paymentPlan.id = company.paymentPlan"
      )
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .where("company.id = :companyId", { companyId })
      .getRawOne();

    const montlhies = await getRepository(CompanyMonthlyPayment)
      .createQueryBuilder("monthly")
      .select([
        "monthly.id",
        "monthly.amountPaid",
        "monthly.isPaid",
        "monthly.isForgiven",
        "monthly.dueDate",
        "monthly.paidDate",
        "monthly.createdAt",
        "monthly.paymentMade",
        "plan.description",
      ])
      .leftJoin(Companies, "company", "company.id = monthly.company")
      .leftJoin(PaymentPlans, "plan", "plan.id = monthly.plan")
      .where("monthly.company = :companyId", { companyId })
      .getRawMany();

    return { companyData, montlhies };
  }
}

export { FindAllCompanyMontlhiesUseCase };
