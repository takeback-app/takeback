import { getRepository } from "typeorm";
import { CompanyStatus } from "../models/CompanyStatus";

function companyStatusRepository() {
  return getRepository(CompanyStatus);
}

export { companyStatusRepository };
