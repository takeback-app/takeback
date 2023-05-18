import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface Props {
  cpf: string;
}

class GetConsumerInfoUseCase {
  async execute({ cpf }: Props) {
    if (!cpf) {
      throw new InternalError("CPF não informado", 400);
    }

    const consumer = await getRepository(Consumers).findOne({
      select: ["fullName", "deactivedAccount"],
      where: { cpf },
    });

    if (consumer?.deactivedAccount) {
      throw new InternalError("O cliente não está ativo no sistema", 400);
    }

    return consumer;
  }
}

export { GetConsumerInfoUseCase };
