import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { InternalError } from "../../../config/GenerateErros";
import { representativeRepository } from "../../../database/repositories/representativeRepository";
import { representativeRefreshTokenRepository } from "../../../database/repositories/representativeRefreshTokenRepository";
import { generateJWTToken } from "../../../config/JWT";

interface SignInUseCaseProps {
  cpf: string;
  password: string;
}

class SignInUseCase {
  async execute({ cpf, password }: SignInUseCaseProps) {
    if (!cpf || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const representative = await representativeRepository().findOne({
      select: ["id", "cpf", "name", "password", "isActive"],
      where: {
        cpf: cpf.replace(/[^\d]/g, ""),
      },
    });

    if (!representative) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (!representative.password || !representative.isActive) {
      throw new InternalError("Usuário não autorizado", 404);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      representative.password
    );

    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    await representativeRefreshTokenRepository().delete({ representative });

    const expiresIn = dayjs().add(45, "day").unix();

    const refreshToken = await representativeRefreshTokenRepository().save({
      representative,
      expiresIn,
    });

    const TIME_TO_EXPIRES = 60 * 60; // 15 minutes

    const token = generateJWTToken(
      {
        id: representative.id,
        name: representative.name,
      },
      process.env.JWT_PRIVATE_KEY,
      TIME_TO_EXPIRES
    );

    return { token, refreshToken: refreshToken.id, name: representative.name };
  }
}

export { SignInUseCase };
