import { InternalError } from "../../../config/GenerateErros";
import { CPFValidate } from "../../../utils/CPFValidate";

import { prisma } from "../../../prisma";
interface Props {
  userId: string;
  cpf: string;
}

class RegisterCpfUserRootUseCase {
  async execute({ userId, cpf }: Props) {
    const user = await prisma.companyUser.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    if (!cpf) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF Inválido", 400);
    }

    const userCPF = await prisma.companyUser.update({
      where: {
        id: userId,
      },
      data: {
        cpf,
      },
    });

    if (!userCPF) {
      throw new InternalError("Houve um erro no registro do cpf", 400);
    }

    return `CPF cadastrado com sucesso`;
  }
}

export { RegisterCpfUserRootUseCase };
