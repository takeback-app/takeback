import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "./registerCompanyUseCase";

class RegisterCompanyController {
  async handle(request: Request, response: Response) {
    const body = request.body;
    const { id } = request["tokenPayload"];

    const useCase = new RegisterCompanyUseCase();

    const company = await useCase.execute({ ...body, representativeId: id });

    return response.status(201).json(company);
  }
}

export { RegisterCompanyController };
