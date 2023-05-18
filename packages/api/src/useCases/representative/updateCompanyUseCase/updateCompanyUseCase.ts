import { GenericError, NotFoundError } from "../../../config/errors";
import { companyAddressRepository } from "../../../database/repositories/companyAddressRepository";
import { companyRepository } from "../../../database/repositories/companyRepository";
import { cnpjValidation } from "../../../utils/CNPJValidate";

type UpdateCompanyUseCaseProps = {
  companyId: string;
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  district: string;
  street: string;
  number: string;
  complement: string;
  zipCode: string;
};

export class UpdateCompanyUseCase {
  async execute(data: UpdateCompanyUseCaseProps) {
    if (
      !data.companyId ||
      !data.corporateName ||
      !data.fantasyName ||
      !data.registeredNumber ||
      !data.phone ||
      !data.email
    ) {
      throw new GenericError("Dados incompletos", 400);
    }

    if (!cnpjValidation(data.registeredNumber.replace(/\D/g, ""))) {
      throw new GenericError("CNPJ inválido", 400);
    }

    const company = await companyRepository()
      .findOne({
        relations: ["address"],
        where: {
          registeredNumber: data.registeredNumber.replace(/\D/g, ""),
        },
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (!company) {
      throw new NotFoundError("Empresa não encontrada");
    }

    if (company.id !== data.companyId) {
      throw new GenericError("O CNPJ informado pertence à outra empresa", 400);
    }

    const companyUpdated = await companyRepository().update(data.companyId, {
      corporateName: data.corporateName.toLowerCase(),
      fantasyName: data.fantasyName.toLowerCase(),
      registeredNumber: data.registeredNumber.replace(/\D/g, ""),
      phone: data.phone.replace(/\D/g, ""),
      email: data.email.toLowerCase(),
    });

    const addressUpdated = await companyAddressRepository().update(
      company.address.id,
      {
        district: data.district.toLowerCase(),
        street: data.street.toLowerCase(),
        number: data.number,
        complement: data.complement.toLowerCase(),
        zipCode: data.zipCode.replace(/\D/g, ""),
      }
    );

    if (companyUpdated.affected === 0) {
      throw new GenericError("Falha ao atualizar dados da empresa", 400);
    }

    if (addressUpdated.affected === 0) {
      throw new GenericError(
        "Falha ao atualizar dados de endereço da empresa",
        400
      );
    }

    return "Dados atualizados";
  }
}
