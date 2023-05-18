import { getRepository } from "typeorm";
import { Representative } from "../../../database/models/Representative";

class FindUseCase {
  async execute() {
    const representatives = await getRepository(Representative).find({
      order: {
        createdAt: "ASC",
      },
    });

    return representatives;
  }
}

export { FindUseCase };
