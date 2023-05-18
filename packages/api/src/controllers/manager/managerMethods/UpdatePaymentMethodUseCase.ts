import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentMethods } from "../../../database/models/PaymentMethod";

interface Props {
  id: number;
  description: string;
}

class UpdatePaymentMethodUseCase {
  async execute({ id, description }: Props) {
    const paymentMethod = await getRepository(PaymentMethods).findOne({
      where: { description },
    });

    if (paymentMethod) {
      throw new InternalError("Forma de pagamento já cadastrada", 400);
    }

    if (paymentMethod && paymentMethod.isTakebackMethod) {
      throw new InternalError(
        "Não é possível editar o método padrão do sistema",
        400
      );
    }

    const updated = await getRepository(PaymentMethods).update(id, {
      description,
    });

    if (updated.affected === 0) {
      throw new InternalError("Houve um erro ao atualizar", 400);
    }

    return "Método atualizado";
  }
}

export { UpdatePaymentMethodUseCase };
