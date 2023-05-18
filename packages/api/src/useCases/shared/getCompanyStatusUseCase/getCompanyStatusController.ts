import { Request, Response } from "express";
import { getCompanyStatusUseCase } from "./getCompanyStatusUseCase";

class GetCompanyStatusController {
  async handle(request: Request, response: Response) {
    const useCase = new getCompanyStatusUseCase();

    const companyStatus = await useCase.execute();

    return response.status(200).json(companyStatus);
  }
}

export { GetCompanyStatusController };
