import { GenericError } from "../../../config/errors";
import { companyRepository } from "../../../database/repositories/companyRepository";

type GetCompaniesUseCaseProps = {
  representativeId?: string;
};

class GetCompaniesUseCase {
  async execute({ representativeId }: GetCompaniesUseCaseProps) {
    if (!representativeId) {
      throw new GenericError("Representante não informado", 400);
    }

    const companies = await companyRepository()
      .find({
        where: {
          representative: {
            id: representativeId,
          },
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
        order: {
          fantasyName: "ASC",
          corporateName: "ASC",
        },
      })
      .catch((err) => {
        if (err) {
          throw new GenericError(err.message, 400);
        }
      });

    return companies;
  }
}

export { GetCompaniesUseCase };
