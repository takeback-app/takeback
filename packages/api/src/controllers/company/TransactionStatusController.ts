import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";

export class TransactionStatusController {
  async index(_request: Request, response: Response) {
    const data = await prisma.transactionStatus.findMany({
      select: { id: true, description: true },
      where: {
        description: {
          in: [
            TransactionStatusEnum.APPROVED,
            TransactionStatusEnum.PAID_WITH_TAKEBACK,
            TransactionStatusEnum.PENDING,
          ],
        },
      },
    });

    return response.json(data);
  }
}
