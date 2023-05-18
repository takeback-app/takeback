import { Request, Response } from "express";
import { UpdateConsumerDataUseCase } from "./updateConsumerDataUseCase";

export class UpdateConsumerDataController {
  async handle(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const useCase = new UpdateConsumerDataUseCase();

    const result = await useCase.execute({
      consumerId,
      values: request.body.values,
    });

    return response.status(200).json(result);
  }
}
