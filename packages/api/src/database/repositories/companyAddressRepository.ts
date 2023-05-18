import { getRepository } from "typeorm";
import { CompaniesAddress } from "../models/CompanyAddress";

function companyAddressRepository() {
  return getRepository(CompaniesAddress);
}

export { companyAddressRepository };
