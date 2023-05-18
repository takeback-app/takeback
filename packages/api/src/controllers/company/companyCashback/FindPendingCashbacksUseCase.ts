import { prisma } from "../../../prisma";
import { Prisma } from "@prisma/client";
interface Props {
  companyId: string;
  order?: Prisma.SortOrder;
}

class FindPendingCashbacksUseCase {
  async execute({ companyId, order = "asc" }: Props) {
    return prisma.transaction.findMany({
      select: {
        id: true,
        totalAmount: true,
        dateAt: true,
        createdAt: true,
        takebackFeeAmount: true,
        cashbackAmount: true,
        backAmount: true,
        transactionPaymentMethods: {
          select: {
            companyPaymentMethod: {
              select: {
                paymentMethod: {
                  select: {
                    description: true,
                  },
                },
              },
            },
          },
        },
        consumer: {
          select: {
            fullName: true,
          },
        },
        transactionStatus: {
          select: {
            description: true,
          },
        },
        companyUser: {
          select: {
            name: true,
          },
        },
      },
      where: {
        companiesId: companyId,
        transactionStatus: {
          description: {
            in: ["Pendente", "Em atraso"],
          },
        },
      },
      orderBy: {
        id: order,
      },
    });
  }
}

export { FindPendingCashbacksUseCase };
