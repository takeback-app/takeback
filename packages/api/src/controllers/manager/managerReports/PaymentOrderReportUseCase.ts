import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderMethods } from "../../../database/models/PaymentOrderMethods";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";

interface FilterProps {
  companyId?: string;
  statusId?: string;
  startDate?: string;
  endDate?: string;
}

interface Props {
  filters?: FilterProps;
}

class PaymentOrderReportUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(PaymentOrder)
      .createQueryBuilder("paymentOrder")
      .select([
        "paymentOrder.id",
        "paymentOrder.value",
        "method.description",
        "status.description",
        "company.fantasyName",
        "companyStatus.description",
      ])
      .leftJoin(
        PaymentOrderMethods,
        "method",
        "method.id = paymentOrder.paymentMethod"
      )
      .leftJoin(PaymentOrderStatus, "status", "status.id = paymentOrder.status")
      .leftJoin(Companies, "company", "company.id = paymentOrder.company")
      .leftJoin(
        CompanyStatus,
        "companyStatus",
        "companyStatus.id = company.status"
      )
      .orderBy("paymentOrder.id", "ASC");

    const query2 = getRepository(PaymentOrder)
      .createQueryBuilder("paymentOrder")
      .select("SUM(paymentOrder.value)", "amount")
      .leftJoin(
        PaymentOrderMethods,
        "method",
        "method.id = paymentOrder.paymentMethod"
      )
      .leftJoin(PaymentOrderStatus, "status", "status.id = paymentOrder.status")
      .leftJoin(Companies, "company", "company.id = paymentOrder.company")
      .leftJoin(
        CompanyStatus,
        "companyStatus",
        "companyStatus.id = company.status"
      )
      .where("status.description <> 'Cancelada' ");

    if (filters.companyId) {
      query.where("company.id = :companyId", { companyId: filters.companyId });
      query2.where("company.id = :companyId", { companyId: filters.companyId });
    }

    if (filters.statusId) {
      query.andWhere("status.id = :statusId", { statusId: filters.statusId });
      query2.andWhere("status.id = :statusId", { statusId: filters.statusId });
    }

    if (filters.startDate) {
      const date = new Date(filters.startDate);
      date.setDate(date.getDate());

      query.andWhere(`paymentOrder.createdAt >= '${date.toISOString()}'`);
      query2.andWhere(`paymentOrder.createdAt >= '${date.toISOString()}'`);
    }

    if (filters.endDate) {
      const date = new Date(filters.endDate);
      date.setDate(date.getDate() + 1);

      query.andWhere(`paymentOrder.createdAt <= '${date.toISOString()}'`);
      query2.andWhere(`paymentOrder.createdAt <= '${date.toISOString()}'`);
    }

    const report = await query.getRawMany();
    const amount = await query2.getRawOne();

    return { report, amount: parseFloat(amount.amount) };
  }
}

export { PaymentOrderReportUseCase };
