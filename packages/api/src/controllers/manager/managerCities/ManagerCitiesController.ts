import { Request, Response } from "express";
import { FindAllCitiesUseCase } from "./FindAllCitiesUseCase";

class ManagerCitiesController {
  async findAllCities(request: Request, response: Response) {
    const find = new FindAllCitiesUseCase();

    const cities = await find.execute();

    return response.status(200).json(cities);
  }
}

export { ManagerCitiesController };
