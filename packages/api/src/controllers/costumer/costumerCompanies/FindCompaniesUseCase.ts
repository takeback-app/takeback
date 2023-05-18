import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Companies } from "../../../database/models/Company";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Industries } from "../../../database/models/Industry";

interface Props {
  userId: string;

  filters?: {
    limit?: string;
    offset?: string;
    industry?: string;
    city?: string;
  };
}

class FindCompaniesUseCase {
  async execute({ filters }: Props) {
    let notFoundAuxiliarToFrontEnd = false;

    const query = getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.fantasyName",
        "industry.description",
        "city.name",
      ])
      .leftJoin(Industries, "industry", "company.industry = industry.id")
      .leftJoin(CompaniesAddress, "address", "company.address = address.id")
      .leftJoin(City, "city", "address.city = city.id")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .limit(parseInt(filters.limit) || 20)
      .offset(parseInt(filters.limit) * parseInt(filters.offset) || 0)
      .where("status.generateCashback = :generateCashback", {
        generateCashback: true,
      });

    if (filters.industry) {
      query.andWhere("industry.id = :industry", { industry: filters.industry });
      notFoundAuxiliarToFrontEnd = true;
    }

    if (filters.city) {
      query.andWhere("city.id = :city", { city: filters.city });
    }

    const companies = await query.getRawMany();

    return { companies, notFoundAuxiliarToFrontEnd };
  }
}

export { FindCompaniesUseCase };
