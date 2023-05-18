import { industryRepository } from "../../../database/repositories/industryRepository";

class GetIndustriesUseCase {
  async execute() {
    const industries = await industryRepository().find();

    return industries;
  }
}

export { GetIndustriesUseCase };
