import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { Consumers } from "../../../database/models/Consumer";
import { PaymentOrder } from "../../../database/models/PaymentOrder";

class FindFiltersOptionsUseCase {
  async execute() {
    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName"],
    });

    const consumers = await getRepository(Consumers).find({
      select: ["id", "fullName"],
    });

    const order = await getRepository(PaymentOrder)
      .createQueryBuilder("order")
      .select(["order.id"])
      .orderBy("order.id")
      .getRawMany();

    return { companies, consumers, order };
  }
}

export { FindFiltersOptionsUseCase };
