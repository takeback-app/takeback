import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { representativeRepository } from "../../../database/repositories/representativeRepository";

interface ResetPasswordUseCaseProps {
  newPassword: string;
  token: string;
}

interface TokenProps {
  id: string;
}

class ResetPasswordUseCase {
  async execute(props: ResetPasswordUseCaseProps) {
    let userId: string;

    if (!props.newPassword || !props.token) {
      throw new InternalError("Dados incompletos", 400);
    }

    jwt.verify(
      props.token,
      process.env.JWT_PRIVATE_KEY,
      (err, decoded: TokenProps): TokenProps => {
        if (err) {
          throw new InternalError("Token inválido", 498);
        }

        userId = decoded.id;

        return decoded;
      }
    );

    const representative = await representativeRepository().findOne({
      where: {
        id: userId,
      },
    });

    if (!representative) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (!representative.isActive) {
      throw new InternalError("Usuário não autorizado", 400);
    }

    const passwordEncrypted = bcrypt.hashSync(props.newPassword, 10);

    await representativeRepository()
      .update(userId, {
        password: passwordEncrypted,
      })
      .catch((err) => {
        throw new InternalError(err.message, 400);
      });

    return "Senha atualizada!";
  }
}

export { ResetPasswordUseCase };
