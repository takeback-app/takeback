import { Request, Response } from "express";
import { FindDataToUseInAplicationUseCase } from "./FindDataToUseInAplicationUseCase";
import { prisma } from "../../../prisma";

class DataController {
  async findDataToUseInApp(request: Request, response: Response) {
    const findData = new FindDataToUseInAplicationUseCase();

    const data = await findData.execute();

    return response.status(200).json(data);
  }

  async cities(_request: Request, response: Response) {
    const cities = await prisma.city.findMany();

    return response.json(
      cities.map((city) => ({ text: city.name, value: city.id }))
    );
  }
}

export { DataController };
