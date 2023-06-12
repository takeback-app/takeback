import { Request, Response } from "express";

import { prisma } from "../../prisma";
import { FindCashbacksUseCase } from "../../useCases/representative/FindCashbacksUseCase";

export class CashbackHistoricController {
  async findCashbacks(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const filters = request.query;

    const findCashbacks = new FindCashbacksUseCase();

    const cashbacks = await findCashbacks.execute({
      ...filters,
      representativeUserId: id,
    });

    response.status(200).json(cashbacks);
  }

  async findStatus(_request: Request, response: Response) {
    const status = await prisma.transactionStatus.findMany({
      select: { id: true, description: true },
    });

    return response.status(200).json(status);
  }
}
