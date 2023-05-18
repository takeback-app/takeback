import { Request, Response } from "express";
import { GetConsumerDataInfoUseCase } from "./getConsumerDataInfoUseCase";

export class GetConsumerInfoController {
  async handle(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const useCase = new GetConsumerDataInfoUseCase();

    const result = await useCase.execute(consumerId);

    response.status(200).json(result);
  }
}
