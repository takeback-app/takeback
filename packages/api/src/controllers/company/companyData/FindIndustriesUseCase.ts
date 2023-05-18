import { getRepository } from "typeorm";
import { Industries } from "../../../database/models/Industry";

class FindIndustriesUseCase {
  async execute() {
    const industries = await getRepository(Industries).find();

    return industries;
  }
}

export { FindIndustriesUseCase };
