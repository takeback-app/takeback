import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../database/models/PaymentMethod";

interface Props {
  companyId: string;
}

class RegisterCompanyTakebackPaymentMethodsUseCase {
  async execute({ companyId }: Props) {
    if (!companyId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);
    const paymentMethod = await getRepository(PaymentMethods).findOne({
      where: { id: 1 },
    });

    const existentMethod = await getRepository(CompanyPaymentMethods).findOne({
      where: { paymentMethod, company },
    });

    if (existentMethod) {
      throw new InternalError("Forma de pagamento já cadastrada", 400);
    }

    const newMethod = await getRepository(CompanyPaymentMethods).save({
      cashbackPercentage: 0,
      isActive: true,
      companyId,
      company,
      paymentMethod,
    });

    if (!newMethod) {
      throw new InternalError("Erro ao cadastrar forma de pagamento", 400);
    }

    return true;
  }
}

export { RegisterCompanyTakebackPaymentMethodsUseCase };
