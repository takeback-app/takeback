import { GenericError } from "../../../config/errors";
import { companyRepository } from "../../../database/repositories/companyRepository";

type GetCompanyUseCaseProps = {
  companyId?: string;
};

class GetCompanyUseCase {
  async execute({ companyId }: GetCompanyUseCaseProps) {
    if (!companyId) {
      throw new GenericError("Id da empresa não informada", 400);
    }

    const companies = await companyRepository()
      .findOne({
        where: {
          id: companyId,
        },
        relations: [
          "representative",
          "status",
          "industry",
          "address",
          "address.city",
          "address.city.state",
          "address.city.zipCode",
          "paymentPlan",
        ],
      })
      .catch((err) => {
        if (err) {
          throw new GenericError(err.message, 400);
        }
      });

    return companies;
  }
}

export { GetCompanyUseCase };
