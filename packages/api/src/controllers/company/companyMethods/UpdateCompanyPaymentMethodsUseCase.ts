import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";

interface Props {
  companyId: string;
  paymentId: number;
  cashbackPercentage: number;
  isActive: boolean;
}

class UpdateCompanyPaymentMethodsUseCase {
  async execute({ companyId, cashbackPercentage, isActive, paymentId }: Props) {
    if (!companyId || !cashbackPercentage || !paymentId) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (cashbackPercentage < 0) {
      throw new InternalError(
        "Não é possível informar percentual negativo",
        400
      );
    }

    if (cashbackPercentage > 100) {
      throw new InternalError(
        "Não é possível informar valores acima de 100%",
        400
      );
    }

    const paymentMethod = await getRepository(CompanyPaymentMethods).findOne({
      where: { id: paymentId },
      relations: ["paymentMethod"],
    });

    if (paymentMethod.paymentMethod.id === 1) {
      throw new InternalError(
        "Não é possível editar o método de pagamento Takeback",
        400
      );
    }

    const updated = await getRepository(CompanyPaymentMethods).update(
      paymentId,
      {
        cashbackPercentage: cashbackPercentage / 100,
        isActive,
      }
    );

    if (updated.affected === 0) {
      throw new InternalError("Erro atualizar método de pagamento", 400);
    }

    return "Método de pagamento atualizado";
  }
}

export { UpdateCompanyPaymentMethodsUseCase };
