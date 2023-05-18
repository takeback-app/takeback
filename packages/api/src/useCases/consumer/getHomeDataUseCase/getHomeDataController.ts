import { Request, Response } from "express";
import { GetHomeDataUseCase } from "./getHomeDataUseCase";

export class GetHomeDataController {
  async handle(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const useCase = new GetHomeDataUseCase();

    const result = await useCase.execute(consumerId);

    return response.status(200).json(result);
  }
}
