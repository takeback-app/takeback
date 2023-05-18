import { getRepository } from "typeorm";
import { SupportUsers } from "../../database/models/SupportUsers";

class FindSupportsUseCase {
  async execute() {
    const supports = await getRepository(SupportUsers).find({
      where: { isActive: true },
    });

    return supports;
  }
}

export { FindSupportsUseCase };
