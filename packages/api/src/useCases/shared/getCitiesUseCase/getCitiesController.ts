import { Request, Response } from "express";
import { GetCitiesUseCase } from "./getCitiesUseCase";

class GetCitiesController {
  async handle(reques: Request, response: Response) {
    const useCase = new GetCitiesUseCase();

    const cities = await useCase.execute();

    return response.status(200).json(cities);
  }
}

export { GetCitiesController };
