import { prisma } from "../../../prisma";
import { Prisma } from "@prisma/client";

interface FilterProps {
  statusId?: string;
}

interface Props {
  companyId: string;
  filters?: FilterProps;
  offset: string;
  limit: string;
  order?: Prisma.SortOrder;
}

class FindAllCashbacksUseCase {
  async execute({ companyId, filters, offset, limit, order = "desc" }: Props) {
    const cashbacks = await prisma.transaction.findMany({
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
        companyUser: { select: { name: true } },
        consumer: { select: { fullName: true } },
        transactionStatus: { select: { description: true } },
      },
      where: {
        transactionStatusId: filters.statusId
          ? Number(filters.statusId)
          : undefined,
        companiesId: companyId,
      },
      orderBy: {
        id: order,
      },
      skip: parseInt(offset) * parseInt(limit),
      take: parseInt(limit),
    });

    return cashbacks;
  }
}

export { FindAllCashbacksUseCase };
