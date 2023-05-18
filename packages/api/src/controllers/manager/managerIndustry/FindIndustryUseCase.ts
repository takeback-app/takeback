import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../database/models/Industry";

interface Props {
  offset: string;
  limit: string;
}
class FindIndustryUseCase {
  async execute({ offset, limit }: Props) {
    const industries = await getRepository(Industries).find({
      select: ["id", "description", "industryFee", "createdAt", "updatedAt"],
      relations: ["companies"],
      order: { description: "ASC" },
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
    });

    if (!industries) {
      throw new InternalError("Não há ramos cadastrados", 400);
    }

    return industries;
  }
}

export { FindIndustryUseCase };
