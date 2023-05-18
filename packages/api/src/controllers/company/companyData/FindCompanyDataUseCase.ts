import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";

interface Props {
  companyId: string;
}

class FindCompanyDataUseCase {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies).findOne(companyId, {
      relations: ["industry", "paymentPlan", "status"],
    });

    return company;
  }
}

export { FindCompanyDataUseCase };
