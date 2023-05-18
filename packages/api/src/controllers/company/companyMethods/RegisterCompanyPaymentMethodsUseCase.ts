import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../database/models/PaymentMethod";

interface Props {
  companyId: string;
  paymentId: number;
  cashbackPercentage: number;
}

class RegisterCompanyPaymentMethodsUseCase {
  async execute({ companyId, cashbackPercentage, paymentId }: Props) {
    if (
      !companyId ||
      cashbackPercentage === undefined ||
      cashbackPercentage === null ||
      cashbackPercentage === 0 ||
      !paymentId
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (cashbackPercentage < 0) {
      throw new InternalError("Percentual negativo informado", 400);
    }

    if (cashbackPercentage > 100) {
      throw new InternalError(
        "Não é possível informar valores acima de 100%",
        400
      );
    }

    const company = await getRepository(Companies).findOne(companyId);
    const paymentMethod = await getRepository(PaymentMethods).findOne(
      paymentId
    );

    const existentMethod = await getRepository(CompanyPaymentMethods).findOne({
      where: { paymentMethod, company },
    });

    if (existentMethod) {
      throw new InternalError("Forma de pagamento já cadastrada", 400);
    }

    const newMethod = await getRepository(CompanyPaymentMethods).save({
      cashbackPercentage: cashbackPercentage / 100,
      isActive: true,
      companyId,
      company,
      paymentMethodId: paymentId,
      paymentMethod,
    });

    if (!newMethod) {
      throw new InternalError("Erro ao cadastrar forma de pagamento", 400);
    }

    return "Método de pagamento cadastrado";
  }
}

export { RegisterCompanyPaymentMethodsUseCase };
