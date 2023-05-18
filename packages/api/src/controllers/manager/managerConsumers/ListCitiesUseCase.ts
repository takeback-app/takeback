import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";

class ListCitiesUseCase {
  async execute() {
    const listCities = await getRepository(City)
      .createQueryBuilder("ci")
      .select(["ci.id", "ci.name"])
      .orderBy("ci.name", "ASC")
      .getRawMany();

    return listCities;
  }
}

export { ListCitiesUseCase };
