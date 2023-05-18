import { getRepository } from "typeorm";
import { CompanyPaymentMethods } from "../models/CompanyPaymentMethod";

function companyPaymentMethodsRepository() {
  return getRepository(CompanyPaymentMethods);
}

export { companyPaymentMethodsRepository };
