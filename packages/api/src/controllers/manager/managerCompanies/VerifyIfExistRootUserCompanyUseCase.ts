import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyUsers } from "../../../database/models/CompanyUsers";

interface Props {
  companyId: string;
}

class VerifyIfExistRootUserCompanyUseCase {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    const managerUser = await getRepository(CompanyUsers).find({
      where: { company, isRootUser: true },
    });

    return managerUser.length > 0;
  }
}

export { VerifyIfExistRootUserCompanyUseCase };
