import { Request, Response } from "express";
import { GetIndustriesUseCase } from "./getIndustriesUseCase";

class GetIndustriesController {
  async handle(request: Request, response: Response) {
    const useCase = new GetIndustriesUseCase();

    const industries = await useCase.execute();

    return response.status(200).json(industries);
  }
}

export { GetIndustriesController };
