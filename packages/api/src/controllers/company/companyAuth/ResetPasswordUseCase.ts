import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { ValidateUserPasswordUseCase } from "../companyCashback/ValidateUserPasswordUseCase";
import { prisma } from "../../../prisma";

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

    const user = await prisma.companyUser.findFirst({
      where: { id: userId, resetPasswordToken: resetToken },
      select: {
        id: true,
        companyId: true,
        isActive: true,
        resetPasswordTokenExpiresDate: true,
      },
    });

    if (!user) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (!user.isActive) {
      throw new InternalError("Usuário inativo", 404);
    }

    const today = new Date();
    const expirateDate = new Date(user.resetPasswordTokenExpiresDate);

    if (today > expirateDate) {
      throw new InternalError("Token expirado", 400);
    }

    await this.validateUniqueUserPassword(user.companyId, newPassword);

    const passwordEncrypted = bcrypt.hashSync(newPassword, 10);

    await prisma.companyUser.update({
      where: { id: user.id },
      data: {
        password: passwordEncrypted,
        resetPasswordToken: "",
        resetPasswordTokenExpiresDate: new Date(),
      },
    });

    return "Senha atualizada";
  }

  async validateUniqueUserPassword(companyId: string, password: string) {
    const useCase = new ValidateUserPasswordUseCase();

    const user = await useCase.findCompanyUserByPassword(companyId, password);

    if (user) {
      throw new InternalError("Sequência não permitida. Use outra.", 400);
    }
  }
}

export { ResetPasswordUseCase };
