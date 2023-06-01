import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";

export class GetUser {
  public static async handle(id: string) {
    const user = await prisma.representativeUser.findUniqueOrThrow({
      where: { id },
      include: { representative: true },
    });

    const isAdmin = user.role === "ADMIN";

    const where: Prisma.CompanyWhereInput = isAdmin
      ? {
          representativeId: user.representativeId,
        }
      : {
          representativeUserCompanies: {
            some: { representativeUserId: user.id },
          },
        };

    return {
      representativeUser: user,
      isAdmin,
      whereCondominiumFilter: where,
    };
  }
}
