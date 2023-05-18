import { InternalError } from "../../../config/GenerateErros";
import { CPFValidate } from "../../../utils/CPFValidate";

import { prisma } from "../../../prisma";

interface Props {
  userId: string;
  userTypeId: string;
  name: string;
  email?: string;
  cpf?: string;
  isActive: boolean;
  isRootUser?: boolean;
}

class UpdateUserCompaniesUseCase {
  async execute({
    userId,
    userTypeId,
    name,
    email,
    cpf,
    isActive,
    isRootUser,
  }: Props) {
    const user = await prisma.companyUser.findFirst({
      include: { company: true },
      where: { id: userId },
    });

    if (!user) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    const companyUserTypes = await prisma.companyUserType.findFirst({
      where: { id: userTypeId ? Number(userTypeId) : null },
    });

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF inválido", 400);
    }

    const userExistsInThisCompany = await prisma.companyUser.findFirst({
      where: {
        OR: [{ name }, { cpf: cpf.replace(/\D/g, "") }],
        AND: [{ company: { id: user.companyId } }],
        NOT: [{ id: userId }],
      },
    });

    if (userExistsInThisCompany) {
      throw new InternalError("Nome de usuário ou CPF já em uso", 400);
    }

    if (companyUserTypes.isManager) {
      if (!email || !cpf) {
        throw new InternalError("Dados incompletos", 400);
      }
    }

    if (isRootUser) {
      await prisma.companyUser.updateMany({
        where: { companyId: user.companyId },
        data: {
          isRootUser: false,
        },
      });
    }

    await prisma.companyUser.update({
      where: { id: userId },
      data: {
        name,
        email,
        isActive,
        isRootUser,
        cpf: cpf.replace(/\D/g, ""),
        companyUserTypesId: companyUserTypes.id,
      },
    });

    return `Usuário ${name} alterado com sucesso`;
  }
}

export { UpdateUserCompaniesUseCase };
