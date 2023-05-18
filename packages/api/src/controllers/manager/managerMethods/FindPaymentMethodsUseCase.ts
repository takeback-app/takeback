import { getRepository } from "typeorm";
import { PaymentMethods } from "../../../database/models/PaymentMethod";

class FindPaymentMethodsUseCase {
  async execute() {
    const methods = await getRepository(PaymentMethods).find({
      order: { id: "ASC" },
    });

    return methods;
  }
}

export { FindPaymentMethodsUseCase };
