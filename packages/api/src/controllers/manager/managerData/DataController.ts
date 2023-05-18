import { Request, Response } from "express";
import { FindDataToUseInAplicationUseCase } from "./FindDataToUseInAplicationUseCase";

class DataController {
  async findDataToUseInApp(request: Request, response: Response) {
    const findData = new FindDataToUseInAplicationUseCase();

    const data = await findData.execute();

    return response.status(200).json(data);
  }
}

export { DataController };
