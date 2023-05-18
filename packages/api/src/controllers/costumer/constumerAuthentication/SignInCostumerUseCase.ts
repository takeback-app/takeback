import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { generateToken } from "../../../config/JWT";
import { Consumers } from "../../../database/models/Consumer";
import { RefreshTokens } from "../../../database/models/RefreshTokens";

interface LoginProps {
  cpf: string;
  password: string;
}

class SignInCostumerUseCase {
  async execute({ cpf, password }: LoginProps) {
    if (!cpf || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumer = await getRepository(Consumers).findOne({
      where: {
        cpf: cpf.replace(/\D/g, ""),
      },
      select: [
        "id",
        "fullName",
        "cpf",
        "email",
        "password",
        "deactivedAccount",
      ],
    });

    if (!consumer) {
      throw new InternalError("CPF não cadastrado", 404);
    }

    if (consumer.deactivedAccount) {
      throw new InternalError("Conta inativa", 400);
    }

    const passwordMatch = await bcrypt.compare(password, consumer.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao efetuar login", 400);
    }

    await getRepository(RefreshTokens).delete({ consumer });

    const expiresIn = dayjs().add(45, "day").unix();

    const refreshToken = await getRepository(RefreshTokens).save({
      consumer,
      expiresIn,
    });

    const token = generateToken(
      {
        id: consumer.id,
        name: consumer.fullName,
      },
      process.env.JWT_PRIVATE_KEY,
      2592000 // 30 dias
    );

    return { token, refreshToken: refreshToken.id, name: consumer.fullName };
  }
}

export { SignInCostumerUseCase };
