import { Request, Response } from "express";
import { GetCompanyUseCase } from "./getCompanyUseCase";

class GetCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const useCase = new GetCompanyUseCase();

    const companies = await useCase.execute({ companyId });

    return response.status(200).json(companies);
  }
}

export { GetCompanyController };
