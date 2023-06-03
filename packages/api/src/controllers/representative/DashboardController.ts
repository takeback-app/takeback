import { Request, Response } from "express";
import { DashboardUseCase } from "../../useCases/representative/DashboardUseCase";
import { CommissionGraphUseCase } from "../../useCases/graphs/CommissionGraphUseCase ";

export class DashboardController {
  async index(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const useCase = new DashboardUseCase();

    const data = await useCase.execute({ representativeUserId: id });

    return response.json(data);
  }

  async commissionGraph(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const useCase = new CommissionGraphUseCase();

    const data = await useCase.execute(6, representativeId);

    return response.json(data);
  }
}
