import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";

interface Props {
  cpf: string;
}

class VerifyIfUserAlreadyExistsUseCase {
  async execute({ cpf }: Props) {
    if (!cpf) {
      throw new InternalError("Dados não informados", 400);
    }

    const costumer = await prisma.consumer.findFirst({
      where: {
        cpf,
        isPlaceholderConsumer: false,
      },
    });

    if (costumer) {
      throw new InternalError("CPF já cadastrado", 400);
    }

    return true;
  }
}

export { VerifyIfUserAlreadyExistsUseCase };
