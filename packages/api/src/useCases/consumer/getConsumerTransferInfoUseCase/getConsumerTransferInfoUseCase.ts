import { InternalError } from "../../../config/GenerateErros";
import { consumerRepository } from "../../../database/repositories/consumerRepository";

export class GetConsumerTransferInfoUseCase {
  async execute(consumerCpf: string, consumerId: string) {
    if (!consumerCpf || !consumerId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumerTransfer = await consumerRepository()
      .findOne({
        select: ["id", "deactivedAccount", "fullName"],
        where: {
          cpf: consumerCpf.replace(/\D/g, ""),
        },
      })
      .then((res) => {
        if (res === undefined) {
          throw new InternalError("Usuário não encontrado", 400);
        }

        return res;
      })
      .catch(() => {
        throw new InternalError("Usuário não encontrado", 400);
      });

    if (consumerId === consumerTransfer.id) {
      throw new InternalError("Não é possível transferir para si mesmo", 400);
    }

    if (!consumerTransfer) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    if (consumerTransfer.deactivedAccount) {
      throw new InternalError("Usuário inativo", 400);
    }

    return consumerTransfer;
  }
}
