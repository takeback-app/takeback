import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { PaymentOrderMethods } from "../../../database/models/PaymentOrderMethods";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";

interface QueryProps {
  statusId?: string;
  companyId?: string;
}

interface PaginationProps {
  limit: string;
  offset: string;
}

interface Props {
  companyId?: string;
  pagination: PaginationProps;
  filters: QueryProps;
}

class FindPaymentOrderUseCase {
  async execute({ companyId, filters, pagination }: Props) {
    const findOrder = getRepository(PaymentOrder)
      .createQueryBuilder("order")
      .select(["order.id", "order.value", "order.createdAt"])
      .addSelect([
        "company.fantasyName",
        "status.description",
        "paymentMethod.description",
      ])
      .leftJoin(Companies, "company", "company.id = order.company")
      .leftJoin(PaymentOrderStatus, "status", "status.id = order.status")
      .leftJoin(
        PaymentOrderMethods,
        "paymentMethod",
        "paymentMethod.id = order.paymentMethod"
      )
      .where("company.id = :companyId", { companyId })
      .limit(parseInt(pagination.limit))
      .offset(parseInt(pagination.offset) * parseInt(pagination.limit))
      .orderBy("order.id", "DESC");

    if (filters.statusId) {
      findOrder.andWhere("status.id = :statusId", {
        statusId: filters.statusId,
      });
    }

    const orders = await findOrder.getRawMany();

    return orders;
  }
}

export { FindPaymentOrderUseCase };
