import { InternalError } from "../../../config/GenerateErros";
import { CPFValidate } from "../../../utils/CPFValidate";

import { prisma } from "../../../prisma";
interface Props {
  companyId: string;
  userId: string;
  userTypeId: string;
  name: string;
  email?: string;
  cpf?: string;
  isActive: boolean;
  isRootUser: boolean;
}

class UpdateCompanyUsersUseCase {
  async execute({
    companyId,
    userId,
    userTypeId,
    name,
    isActive,
    email,
    cpf,
    isRootUser,
  }: Props) {
    if (!companyId || !userId || !userTypeId || !name) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    const userExist = await prisma.companyUser.findFirst({
      where: { id: userId },
    });

    if (!userExist) {
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
        AND: [{ company: { id: companyId } }],
        NOT: [{ id: userId }],
      },
    });

    if (userExistsInThisCompany) {
      throw new InternalError("Nome de usuário ou CPF já em uso", 400);
    }

    if (companyUserTypes.isManager) {
      if (companyUserTypes.isManager && (!email || !cpf)) {
        throw new InternalError("Dados incompletos", 400);
      }

      await prisma.companyUser.update({
        where: { id: userId },
        data: {
          name,
          companyUserTypesId: companyUserTypes.id,
          isActive,
          email,
          cpf: cpf.replace(/\D/g, ""),
        },
      });

      return `Usuário ${name} alterado com sucesso`;
    } else {
      await prisma.companyUser.update({
        where: { id: userId },
        data: {
          name,
          cpf,
          isActive,
          companyUserTypesId: isRootUser
            ? companyUserTypes.id
            : userExist.companyUserTypesId,
        },
      });

      return `Usuário ${name} alterado com sucesso`;
    }
  }
}

export { UpdateCompanyUsersUseCase };
