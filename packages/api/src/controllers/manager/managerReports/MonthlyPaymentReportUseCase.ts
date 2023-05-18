import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { PaymentPlans } from "../../../database/models/PaymentPlans";

interface FilterProps {
  companyId?: string;
  isPaid?: string;
  startDate?: string;
  endDate?: string;
}

interface Props {
  filters?: FilterProps;
}

class MonthlyPaymentReportUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(CompanyMonthlyPayment)
      .createQueryBuilder("monthlyPayment")
      .select([
        "monthlyPayment.id",
        "monthlyPayment.amountPaid",
        "monthlyPayment.isPaid",
        "monthlyPayment.paidDate",
        "monthlyPayment.createdAt",
        "plan.description",
        "company.fantasyName",
        "companyStatus.description",
      ])
      .leftJoin(PaymentPlans, "plan", "plan.id = monthlyPayment.plan")
      .leftJoin(Companies, "company", "company.id = monthlyPayment.company")
      .leftJoin(
        CompanyStatus,
        "companyStatus",
        "companyStatus.id = company.status"
      )
      .orderBy("monthlyPayment.id", "ASC");

    if (filters.companyId) {
      query.where("company.id = :companyId", { companyId: filters.companyId });
    }

    if (filters.isPaid) {
      query.andWhere("monthlyPayment.isPaid = :isPaid", {
        isPaid: filters.isPaid === "true" ? true : false,
      });
    }

    if (filters.startDate) {
      const date = new Date(filters.startDate);
      date.setDate(date.getDate());

      query.andWhere(`monthlyPayment.createdAt >= '${date.toISOString()}'`);
    }

    if (filters.endDate) {
      const date = new Date(filters.endDate);
      date.setDate(date.getDate() + 1);

      query.andWhere(`monthlyPayment.createdAt <= '${date.toISOString()}'`);
    }

    const report = await query.getRawMany();

    return report;
  }
}

export { MonthlyPaymentReportUseCase };
