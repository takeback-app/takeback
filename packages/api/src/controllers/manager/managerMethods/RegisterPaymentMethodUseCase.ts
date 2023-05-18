import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentMethods } from "../../../database/models/PaymentMethod";

interface Props {
  description: string;
}

class RegisterPaymentMethodUseCase {
  async execute({ description }: Props) {
    const method = await getRepository(PaymentMethods).findOne({
      where: { description },
    });

    if (method) {
      throw new InternalError("Forma de pagamento já cadastrada", 400);
    }

    const newMethod = await getRepository(PaymentMethods).save({
      description,
      isTakebackMethod: false,
    });

    if (newMethod) {
      return "Método cadastrado";
    }

    throw new InternalError("Houve um erro", 400);
  }
}

export { RegisterPaymentMethodUseCase };
