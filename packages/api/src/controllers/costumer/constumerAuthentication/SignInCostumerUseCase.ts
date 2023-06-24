import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";
import { GenerateConsumerTokenUseCase } from "./GenerateConsumerTokenUseCase";

interface LoginProps {
  cpf: string;
  password: string;
}

class SignInCostumerUseCase {
  async execute({ cpf, password }: LoginProps) {
    if (!cpf || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumer = await prisma.consumer.findFirst({
      where: { cpf: cpf.replace(/\D/g, "") },
    });

    if (!consumer) {
      throw new InternalError("CPF não cadastrado", 404);
    }

    if (consumer.deactivatedAccount) {
      throw new InternalError("Conta inativa", 400);
    }

    const passwordMatch = await bcrypt.compare(password, consumer.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao efetuar login", 400);
    }

    const data = await GenerateConsumerTokenUseCase.handle(consumer);

    return { ...data, name: consumer.fullName };
  }
}

export { SignInCostumerUseCase };
