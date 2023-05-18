import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { Cache } from "../../../redis";
import { solicitationKey } from "../../../services/cacheKeys";

export class WaitingController {
  async count(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const cacheKey = solicitationKey(companyId);

    const value = await Cache.rememberForever<number>(cacheKey, async () => {
      const waitingTransactionStatus = await prisma.transactionStatus.findFirst(
        {
          where: { description: "Aguardando" },
        }
      );

      return prisma.transaction.count({
        where: {
          companiesId: companyId,
          transactionStatusId: waitingTransactionStatus.id,
          keyTransaction: null,
        },
      });
    });

    return response.json({ count: value });
  }
}
