import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { PaymentOrderMethods } from "../../../database/models/PaymentOrderMethods";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";

interface Props {
  filters: {
    status?: string;
    paymentMethod?: string;
    company?: string;
    limit?: string;
    offset?: string;
    startDate?: string;
    endDate?: string;
  };
}

class FindPaymentOrdersUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(PaymentOrder)
      .createQueryBuilder("order")
      .select([
        "order.id",
        "order.value",
        "order.createdAt",
        "order.approvedAt",
        "order.ticketName",
        "order.ticketPath",
        "order.pixKey",
      ])
      .addSelect([
        "company.id",
        "company.fantasyName",
        "company.email",
        "status.description",
        "paymentMethod.id",
        "paymentMethod.description",
      ])
      .leftJoin(Companies, "company", "company.id = order.company")
      .leftJoin(PaymentOrderStatus, "status", "status.id = order.status")
      .leftJoin(
        PaymentOrderMethods,
        "paymentMethod",
        "paymentMethod.id = order.paymentMethod"
      )
      .orderBy("order.id", "DESC")
      .limit(parseInt(filters.limit) || 60)
      .offset(parseInt(filters.offset) * parseInt(filters.limit) || 0);

    if (filters.status) {
      query.andWhere("status.id = :statusId", {
        statusId: parseInt(filters.status),
      });
    }

    if (filters.paymentMethod) {
      query.andWhere("paymentMethod.id = :paymentMethodId", {
        paymentMethodId: parseInt(filters.paymentMethod),
      });
    }

    if (filters.company) {
      query.andWhere("company.fantasyName ILIKE :company", {
        company: `%${filters.company}%`,
      });

      query.orWhere("company.registeredNumber ILIKE :company", {
        company: `%${filters.company}%`,
      });
    }

    if (
      filters.startDate &&
      filters.startDate !== undefined &&
      filters.startDate !== null
    ) {
      const date = new Date(filters.startDate);
      date.setDate(date.getDate());

      query.andWhere(`order.createdAt >= '${date.toISOString()}'`);
    }

    if (
      filters.endDate &&
      filters.endDate !== undefined &&
      filters.endDate !== null
    ) {
      const date = new Date(filters.endDate);
      date.setDate(date.getDate() + 1);

      query.andWhere(`order.createdAt <= '${date.toISOString()}'`);
    }

    const orders = await query.getRawMany();

    return orders;
  }
}

export { FindPaymentOrdersUseCase };
