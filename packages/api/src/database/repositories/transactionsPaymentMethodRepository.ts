import { getRepository } from "typeorm";
import { TransactionPaymentMethods } from "../models/TransactionPaymentMethod";

function transactionsPaymentMethodRepository() {
  return getRepository(TransactionPaymentMethods);
}

export { transactionsPaymentMethodRepository };
