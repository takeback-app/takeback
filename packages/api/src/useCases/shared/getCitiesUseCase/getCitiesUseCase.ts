import { cityRepository } from "../../../database/repositories/cityRepository";

class GetCitiesUseCase {
  async execute() {
    const cities = await cityRepository().find({
      relations: ["state", "zipCode"],
    });

    return cities;
  }
}

export { GetCitiesUseCase };
