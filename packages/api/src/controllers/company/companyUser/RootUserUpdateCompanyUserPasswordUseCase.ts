import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";
import { ValidateUserPasswordUseCase } from "../companyCashback/ValidateUserPasswordUseCase";

interface Props {
  userName: string;
  newPassword: string;
  companyId: string;
  userId: string;
  userToUpdateId: string;
}

class RootUserUpdateCompanyUserPasswordUseCase {
  async execute({
    companyId,
    newPassword,
    userId,
    userName,
    userToUpdateId,
  }: Props) {
    if (!userName || !newPassword || !userId || !userToUpdateId || !companyId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await prisma.companyUser.findFirst({
      where: { id: userId, companyId },
    });

    const companyUser = await prisma.companyUser.findFirst({
      where: { id: userToUpdateId, companyId },
      select: {
        id: true,
        name: true,
        password: true,
        company: true,
        companyUserType: true,
      },
    });

    if (!companyUser) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (companyUser.name !== userName) {
      throw new InternalError("Nome do usuário incorreto", 400);
    }

    await this.validateUniqueUserPassword(
      companyId,
      companyUser.id,
      newPassword
    );

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    await prisma.companyUser.update({
      where: { id: companyUser.id },
      data: { password: newPasswordEncrypted },
    });

    return "Senha atualizada!";
  }

  async validateUniqueUserPassword(
    companyId: string,
    userId: string,
    password: string
  ) {
    const useCase = new ValidateUserPasswordUseCase();

    const user = await useCase.findCompanyUserByPassword(companyId, password);

    if (!user) {
      return;
    }

    if (user.id !== userId) {
      throw new InternalError("Sequência não permitida. Use outra.", 400);
    }
  }
}

export { RootUserUpdateCompanyUserPasswordUseCase };
