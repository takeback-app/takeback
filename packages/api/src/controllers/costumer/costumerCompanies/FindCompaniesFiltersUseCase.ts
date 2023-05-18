import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Companies } from "../../../database/models/Company";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { Industries } from "../../../database/models/Industry";

class FindCompaniesFiltersUseCase {
  async execute() {
    // Buscando as cidades e as empresas cadastradas nelas
    const citiesQuery = await getRepository(City)
      .createQueryBuilder("city")
      .select(["city.id", "city.name", "company.fantasyName"])
      .leftJoin(
        CompaniesAddress,
        "companyAddress",
        "companyAddress.city = city.id"
      )
      .leftJoin(Companies, "company", "company.address = companyAddress.id")
      .getRawMany();

    // Filtrando apenas cidades que possuem empresas cadastradas
    const citiesWithCompanies = [];
    citiesQuery.map((city) => {
      if (city.company_fantasyName) {
        citiesWithCompanies.push({
          id: city.city_id,
          name: city.city_name,
        });
      }
    });

    // Removendo ítens duplicados
    const cities = citiesWithCompanies.filter((city) => {
      return !this[JSON.stringify(city)] && (this[JSON.stringify(city)] = true);
    }, Object.create(null));

    // Buscando os ramos de atividade e as empresas cadastradas neles
    const industriesQuery = await getRepository(Industries)
      .createQueryBuilder("industry")
      .select(["industry.id", "industry.description", "company.fantasyName"])
      .leftJoin(Companies, "company", "company.industry = industry.id")
      .getRawMany();

    // Filtrando apenas ramos de atividade que possuem empresas cadastradas
    const industriesWithCompanies = [];
    industriesQuery.map((industry) => {
      if (industry.company_fantasyName) {
        industriesWithCompanies.push({
          id: industry.industry_id,
          description: industry.industry_description,
        });
      }
    });

    // Removendo ítens duplicados
    const industries = industriesWithCompanies.filter((industry) => {
      return (
        !this[JSON.stringify(industry)] &&
        (this[JSON.stringify(industry)] = true)
      );
    }, Object.create(null));

    return { cities, industries };
  }
}

export { FindCompaniesFiltersUseCase };
