import { Request, Response } from "express";

import { FindCashbacksUseCase } from "./FindCashbacksUseCase";
import { FindCashbackStatusUseCase } from "./FindCashbacksStatusUseCase";

class ManagerCashbacksController {
  async findCashbacks(request: Request, response: Response) {
    const filters = request.query;

    const findCashbacks = new FindCashbacksUseCase();

    const cashbacks = await findCashbacks.execute(filters);

    response.status(200).json(cashbacks);
  }

  async findStatus(request: Request, response: Response) {
    const find = new FindCashbackStatusUseCase();

    const result = await find.execute();

    return response.status(200).json(result);
  }
}

export { ManagerCashbacksController };
