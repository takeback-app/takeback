import dayjs from "dayjs";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";
import { RefreshTokens } from "../../../database/models/RefreshTokens";
import { generateToken } from "../../../config/JWT";
import { validateUUID } from "../../../utils/ValidateUUID";

class RefreshTokenUseCase {
  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new InternalError("Token não informado", 400);
    }

    if (!validateUUID(refreshToken)) {
      throw new InternalError("Token inválido", 400);
    }

    const token = await getRepository(RefreshTokens).findOne({
      where: { id: refreshToken },
      relations: ["consumer"],
    });

    if (!token) {
      throw new InternalError("Token inválido", 400);
    }

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(token.expiresIn));

    if (refreshTokenExpired) {
      throw new InternalError("Token exiprado", 400);
    }

    const consumer = await getRepository(Consumers).findOne({
      where: {
        id: token.consumer.id,
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

    if (consumer.deactivedAccount) {
      throw new InternalError("Conta inativa", 400);
    }

    await getRepository(RefreshTokens).delete({ consumer });

    const expiresIn = dayjs().add(45, "day").unix();

    const newRefreshToken = await getRepository(RefreshTokens).save({
      consumer,
      expiresIn,
    });

    const newAccessToken = generateToken(
      {
        id: consumer.id,
        name: consumer.fullName,
      },
      process.env.JWT_PRIVATE_KEY,
      2592000 // 30 dias
    );

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken.id,
      name: consumer.fullName,
    };
  }
}

export { RefreshTokenUseCase };
