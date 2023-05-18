import { prisma } from "../../../prisma";

interface Props {
  companyId: string;
}

class FindUserCompaniesUseCase {
  async execute({ companyId }: Props) {
    const users = await prisma.companyUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        isActive: true,
        isRootUser: true,
        companyUserType: true,
        companyId: true,
      },
      where: {
        companyId: companyId,
      },
      orderBy: {
        isRootUser: "desc",
      },
    });

    const userTypes = await prisma.companyUserType.findMany();

    return { users, userTypes };
  }
}

export { FindUserCompaniesUseCase };
