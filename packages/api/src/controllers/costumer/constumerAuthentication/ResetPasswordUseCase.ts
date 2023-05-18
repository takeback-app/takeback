import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface Props {
  newPassword: string;
  token: string;
}

interface TokenProps {
  userId: string;
  token: string;
}

class ResetPasswordUseCase {
  async execute({ newPassword, token }: Props) {
    let userId: string;
    let resetToken: string;

    if (!newPassword || !token) {
      throw new InternalError("Dados incompletos", 400);
    }

    jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY,
      (err, decoded: TokenProps): TokenProps => {
        if (err) {
          throw new InternalError("Token inválido", 498);
        }

        userId = decoded.userId;
        resetToken = decoded.token;

        return decoded;
      }
    );

    const user = await getRepository(Consumers).findOne({
      select: [
        "id",
        "deactivedAccount",
        "resetPasswordToken",
        "resetPasswordTokenExpiresDate",
      ],
      where: { id: userId },
    });

    if (!user) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (user.deactivedAccount) {
      throw new InternalError("Usuário inativo", 404);
    }

    const today = new Date();
    const expirateDate = new Date(user.resetPasswordTokenExpiresDate);

    if (today > expirateDate) {
      throw new InternalError("Token expirado", 400);
    }

    if (user.resetPasswordToken !== resetToken) {
      throw new InternalError("Token inválido!", 400);
    }

    const passwordEncrypted = bcrypt.hashSync(newPassword, 10);

    const updatedUser = await getRepository(Consumers).update(user.id, {
      password: passwordEncrypted,
      resetPasswordToken: "",
      resetPasswordTokenExpiresDate: new Date(),
    });

    if (updatedUser.affected === 0) {
      throw new InternalError("Houve um erro inesperado!", 400);
    }

    return { message: "Senha atualizada" };
  }
}

export { ResetPasswordUseCase };
