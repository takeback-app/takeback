import { getRepository } from "typeorm";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";

interface Props {
  companyId: string;
}

class FindCompanyPaymentMethodsUseCase {
  async execute({ companyId }: Props) {
    const companyMethods = await getRepository(CompanyPaymentMethods).find({
      where: { company: { id: companyId } },
      relations: ["paymentMethod"],
      order: { createdAt: "DESC" },
    });

    return companyMethods;
  }
}

export { FindCompanyPaymentMethodsUseCase };
