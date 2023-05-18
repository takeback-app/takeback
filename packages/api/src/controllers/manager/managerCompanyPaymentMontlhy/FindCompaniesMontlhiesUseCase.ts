import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";
import { PaymentPlans } from "../../../database/models/PaymentPlans";

interface Props {
  filters?: {
    isPaid?: string;
    isForgiven?: string;
    planId?: number;
    startDate?: string;
    endDate?: string;
    company?: string;
    limit?: string;
    offset?: string;
  };
}

class FindCompaniesMontlhiesUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(CompanyMonthlyPayment)
      .createQueryBuilder("montlhyPayment")
      .select([
        "montlhyPayment.id",
        "montlhyPayment.amountPaid",
        "montlhyPayment.isPaid",
        "montlhyPayment.isForgiven",
        "montlhyPayment.dueDate",
        "montlhyPayment.paidDate",
        "montlhyPayment.paymentMade",
        "montlhyPayment.createdAt",
        "company.id",
        "company.fantasyName",
        "company.registeredNumber",
        "paymentPlan.id",
        "paymentPlan.description",
        "paymentPlan.value",
      ])
      .leftJoin(Companies, "company", "montlhyPayment.company = company.id")
      .leftJoin(
        PaymentPlans,
        "paymentPlan",
        "montlhyPayment.plan = paymentPlan.id"
      )
      .limit(parseInt(filters.limit) || 20)
      .offset(parseInt(filters.offset) * parseInt(filters.limit) || 0)
      .orderBy("montlhyPayment.createdAt", "DESC");

    if (
      filters.company &&
      filters.company !== undefined &&
      filters.company !== null
    ) {
      query.where("company.fantasyName ILIKE :fantasyName", {
        fantasyName: `%${filters.company}%`,
      });

      query.orWhere("company.registeredNumber ILIKE :registeredNumber", {
        registeredNumber: `%${filters.company}%`,
      });
    }

    if (
      filters.isPaid &&
      filters.isPaid !== undefined &&
      filters.isPaid !== null &&
      !filters.isForgiven
    ) {
      query.andWhere("montlhyPayment.isPaid = :isPaid", {
        isPaid: filters.isPaid === "true",
      });

      query.andWhere("montlhyPayment.isForgiven = :isForgiven", {
        isForgiven: false,
      });
    }

    if (
      filters.isForgiven &&
      filters.isForgiven !== undefined &&
      filters.isForgiven !== null
    ) {
      query.andWhere("montlhyPayment.isForgiven = :isForgiven", {
        isForgiven: filters.isForgiven === "true",
      });
    }

    if (
      filters.planId &&
      filters.planId !== undefined &&
      filters.planId !== null
    ) {
      query.andWhere("paymentPlan.id = :planId", { planId: filters.planId });
    }

    if (
      filters.startDate &&
      filters.startDate !== undefined &&
      filters.startDate !== null
    ) {
      const date = new Date(filters.startDate);
      date.setDate(date.getDate());

      query.andWhere(`montlhyPayment.createdAt >= '${date.toISOString()}'`);
    }

    if (
      filters.endDate &&
      filters.endDate !== undefined &&
      filters.endDate !== null
    ) {
      const date = new Date(filters.endDate);
      date.setDate(date.getDate() + 1);

      query.andWhere(`montlhyPayment.createdAt <= '${date.toISOString()}'`);
    }

    const monthlies = await query.getRawMany();

    return monthlies;
  }
}

export { FindCompaniesMontlhiesUseCase };
