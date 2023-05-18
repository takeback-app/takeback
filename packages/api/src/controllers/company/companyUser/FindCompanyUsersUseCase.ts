import { prisma } from "../../../prisma";
interface Props {
  companyId: string;
  office: string;
  isRootUser: boolean;
}

class FindCompanyUsersUseCase {
  async execute({ companyId, isRootUser, office }: Props) {
    if (isRootUser || office.toLowerCase() === "suporte") {
      const users = await prisma.companyUser.findMany({
        where: {
          companyId,
        },
        include: {
          companyUserType: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const userTypes = await prisma.companyUserType.findMany();

      return { users, userTypes };
    } else {
      const users = await prisma.companyUser.findMany({
        where: {
          companyId,
        },
        include: {
          companyUserType: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const userTypes = await prisma.companyUserType.findMany();

      return { users, userTypes };
    }
  }
}

export { FindCompanyUsersUseCase };
