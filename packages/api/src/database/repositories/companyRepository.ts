import { getRepository } from "typeorm";
import { Companies } from "../models/Company";

function companyRepository() {
  return getRepository(Companies);
}

export { companyRepository };
