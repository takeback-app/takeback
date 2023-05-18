import { Request, Response } from "express";
import { GetCompaniesUseCase } from "./getCompaniesUseCase";

class GetCompaniesController {
  async handle(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const useCase = new GetCompaniesUseCase();

    const companies = await useCase.execute({ representativeId: id });

    return response.status(200).json(companies);
  }
}

export { GetCompaniesController };
