import { companyStatusRepository } from "../../../database/repositories/companyStatusRepository";

class getCompanyStatusUseCase {
  async execute() {
    const companyStatus = companyStatusRepository().find();

    return companyStatus;
  }
}

export { getCompanyStatusUseCase };
