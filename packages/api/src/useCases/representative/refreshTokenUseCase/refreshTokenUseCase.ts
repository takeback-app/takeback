import dayjs from "dayjs";

import { InternalError } from "../../../config/GenerateErros";
import { generateJWTToken } from "../../../config/JWT";
import { validateUUID } from "../../../utils/ValidateUUID";
import { representativeRefreshTokenRepository } from "../../../database/repositories/representativeRefreshTokenRepository";

class RefreshTokenUseCase {
  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new InternalError("Token não informado", 400);
    }

    if (!validateUUID(refreshToken)) {
      throw new InternalError("Token inválido", 400);
    }

    const token = await representativeRefreshTokenRepository().findOne({
      where: { id: refreshToken },
      relations: ["representative"],
    });

    if (!token) {
      throw new InternalError("Token inválido", 400);
    }

    const refreshTokenExpired = dayjs().isAfter(dayjs.unix(token.expiresIn));

    if (refreshTokenExpired) {
      throw new InternalError("Token expirado", 400);
    }

    if (!token.representative.isActive) {
      throw new InternalError("Conta inativa", 400);
    }

    await representativeRefreshTokenRepository().delete({
      representative: token.representative,
    });

    const expiresIn = dayjs().add(45, "day").unix();

    const newRefreshToken = await representativeRefreshTokenRepository().save({
      representative: token.representative,
      expiresIn,
    });

    const TIME_TO_EXPIRES = 60 * 15; // 15 minutes

    const newAccessToken = generateJWTToken(
      {
        id: token.representative.id,
        name: token.representative.name,
      },
      process.env.JWT_PRIVATE_KEY,
      TIME_TO_EXPIRES
    );

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken.id,
      name: newRefreshToken.representative.name,
    };
  }
}

export { RefreshTokenUseCase };
