import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Companies } from "../../../database/models/Company";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Industries } from "../../../database/models/Industry";

interface Props {
  limit: string;
  offset: string;
  filters?: {
    cityId?: string;
    industryId?: string;
  };
}

class CostumerFindCompaniesUseCase {
  async execute({ limit, offset, filters }: Props) {
    const query = getRepository(Companies)
      .createQueryBuilder("company")
      .select(["company.id", "company.fantasyName", "company.createdAt"])
      .addSelect(["industry.id", "industry.description"])
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .where("status.blocked = :bloqued", { bloqued: false })
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .orderBy("company.fantasyName", "ASC");

    if (filters.cityId) {
      query.andWhere("city.id = :cityId", { cityId: parseInt(filters.cityId) });
    }

    if (filters.industryId) {
      query.andWhere("industry.id = :industryId", {
        industryId: parseInt(filters.industryId),
      });
    }

    const companies = query.getRawMany();

    return companies;
  }
}

export { CostumerFindCompaniesUseCase };
