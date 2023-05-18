import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Industries } from "../../../database/models/Industry";
import { PaymentPlans } from "../../../database/models/PaymentPlans";

class FindDataToUseInAplicationUseCase {
  async execute() {
    const industries = await getRepository(Industries).find({
      select: ["id", "description", "industryFee"],
      order: { id: "ASC" },
    });

    const status = await getRepository(CompanyStatus).find({
      select: ["id", "description", "blocked"],
      order: { description: "ASC" },
    });

    const cities = await getRepository(City).find({
      select: ["id", "name"],
      relations: ["state", "zipCode"],
      order: { name: "ASC" },
    });

    const plans = await getRepository(PaymentPlans).find({
      order: { id: "ASC" },
    });

    return { industries, status, cities, plans };
  }
}

export { FindDataToUseInAplicationUseCase };
