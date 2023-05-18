import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface Props {
  deactivedAccount: boolean;
  consumerId: string;
}

class UpdateStatusConsumerUseCase {
  async execute({ deactivedAccount, consumerId }: Props) {
    const consumer = await getRepository(Consumers).findOne({
      where: { id: consumerId },
    });

    if (!consumer) {
      throw new InternalError("Cliente não encontrado", 404);
    }

    const updateConsumerStatus = await getRepository(Consumers).update(
      consumerId,
      {
        deactivedAccount,
      }
    );

    if (updateConsumerStatus.affected === 0) {
      throw new InternalError("Erro ao atualizar usuário", 500);
    }

    return "Usuário atualizado";
  }
}

export { UpdateStatusConsumerUseCase };
