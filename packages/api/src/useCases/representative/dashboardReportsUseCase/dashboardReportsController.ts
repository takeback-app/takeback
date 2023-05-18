import { Request, Response } from "express";
import { DashboardReportsUseCase } from "./dashboardReportsUseCase";

export class DashboardReportsController {
  async handle(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const useCase = new DashboardReportsUseCase();

    const data = await useCase.execute({ representativeId: id });

    return response.status(200).json(data);
  }
}
