import bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";
import { CompanyUser } from "@prisma/client";

interface Props {
  companyId: string;
  userId: string;
  password: string;
}

class ValidateUserPasswordUseCase {
  async execute({ companyId, userId, password }: Props) {
    if (!userId || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    //Verificando se o usuário logado é suporte
    const userSupport = await prisma.supportUser.findFirst({
      where: { id: userId },
    });

    if (userSupport) {
      throw new InternalError("Usuário não autorizado.", 400);
    }

    const user = await this.findCompanyUserByPassword(companyId, password);

    if (!user) {
      throw new InternalError("Senha inválida", 400);
    }

    return { message: true };
  }

  async findCompanyUserByPassword(
    companyId: string,
    password: string
  ): Promise<Partial<CompanyUser>> {
    const users = await prisma.companyUser.findMany({
      where: { companyId, password: { not: null }, isActive: true },
      select: { id: true, password: true, cpf: true },
    });

    for (const user of users) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) return user;
    }

    return null;
  }
}

export { ValidateUserPasswordUseCase };
