import { Consumer, Prisma, StoreVisitType } from "@prisma/client";
import { DateTime } from "luxon";
import { prisma } from "../../prisma";

interface GetAudienceDto {
  audienceSex?: "MALE" | "FEMALE" | "ALL";
  minAudienceAge?: number;
  maxAudienceAge?: number;
  audienceBalance?: number;
  storeVisitType?: "ALL" | "NEVER" | "FROM_THE_DATE_OF_PURCHASE";
  dateOfPurchase?: string;
  hasChildren?: boolean;
}

export class GetAudienceUseCase {
  constructor(private companyId: string, private cityId: number) {}

  async countAudience(dto: GetAudienceDto): Promise<number> {
    return prisma.consumer.count({ where: this.getPrismaWhere(dto) });
  }

  async getAudience(dto: GetAudienceDto): Promise<Consumer[]> {
    return prisma.consumer.findMany({ where: this.getPrismaWhere(dto) });
  }

  private getPrismaWhere({
    audienceSex = "ALL",
    storeVisitType = "ALL",
    audienceBalance,
    dateOfPurchase,
    hasChildren,
    maxAudienceAge,
    minAudienceAge,
  }: GetAudienceDto): Prisma.ConsumerWhereInput {
    return {
      sex: audienceSex !== "ALL" ? audienceSex : undefined,
      balance: { gt: audienceBalance ? audienceBalance : undefined },
      hasChildren: hasChildren ? hasChildren : undefined,
      consumerAddress: { cityId: this.cityId },
      transactions: this.getTransactionFilter(
        storeVisitType,
        DateTime.fromISO(dateOfPurchase).endOf("day").toJSDate()
      ),
      birthDate:
        !!minAudienceAge && !!maxAudienceAge
          ? {
              lte: DateTime.now()
                .minus({ years: minAudienceAge })
                .startOf("year")
                .toJSDate(),
              gte: DateTime.now()
                .minus({ years: maxAudienceAge })
                .startOf("year")
                .toJSDate(),
            }
          : undefined,
    };
  }

  private getTransactionFilter(
    storeVisitType: StoreVisitType,
    dateOfPurchase: Date
  ): Prisma.TransactionListRelationFilter {
    if (storeVisitType === "ALL") return undefined;

    if (storeVisitType === "NEVER")
      return { none: { companiesId: this.companyId } };

    return {
      some: { companiesId: this.companyId, createdAt: { lte: dateOfPurchase } },
      none: { companiesId: this.companyId, createdAt: { gt: dateOfPurchase } },
    };
  }
}
