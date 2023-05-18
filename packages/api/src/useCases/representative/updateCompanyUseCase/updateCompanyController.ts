import { Request, Response } from "express";
import { UpdateCompanyUseCase } from "./updateCompanyUseCase";

export class UpdateCompanyController {
  async handle(request: Request, response: Response) {
    const body = request.body;
    const { companyId } = request.params;

    const useCase = new UpdateCompanyUseCase();

    const result = await useCase.execute({ companyId, ...body });

    return response.status(200).json(result);
  }
}
