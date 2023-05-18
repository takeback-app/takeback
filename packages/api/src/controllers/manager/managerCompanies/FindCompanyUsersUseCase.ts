import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyUsers } from "../../../database/models/CompanyUsers";

interface Props {
  companyId: string;
}

class FindCompanyUsersUseCase {
  async execute({ companyId }: Props) {
    const users = await getRepository(CompanyUsers)
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.isRootUser", "user.isActive"])
      .leftJoin(Companies, "company", "company.id = user.company")
      .where("company.id = :companyId", {
        companyId,
      })
      .getRawMany();

    return users;
  }
}

export { FindCompanyUsersUseCase };
