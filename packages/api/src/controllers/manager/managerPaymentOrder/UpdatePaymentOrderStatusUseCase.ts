import { getRepository, ILike } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";

interface Props {
  orderId: number;
}

class UpdatePaymentOrderStatusUseCase {
  async execute({ orderId }: Props) {
    if (!orderId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const order = await getRepository(PaymentOrder).findOne({
      where: { id: orderId },
      relations: ["status"],
    });

    if (order.status.description !== "Pagamento solicitado") {
      throw new InternalError(
        "Ordem de pagamento cancelada pelo parceiro",
        400
      );
    }

    const status = await getRepository(PaymentOrderStatus).findOne({
      where: { description: ILike("aguardando confirmacao") },
    });

    const updated = await getRepository(PaymentOrder).update(orderId, {
      status,
    });

    if (updated.affected === 0) {
      throw new InternalError("Erro ao atualizar status", 400);
    }

    return "Status atualizado";
  }
}

export { UpdatePaymentOrderStatusUseCase };
