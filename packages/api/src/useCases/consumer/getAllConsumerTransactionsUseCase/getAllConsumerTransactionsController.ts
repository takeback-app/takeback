import { Request, Response } from "express";
import { GetAllConsumerTransactionsUseCase } from "./getAllConsumerTransactionsUseCase";

export class GetAllConsumerTransactionsController {
  async handle(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const useCase = new GetAllConsumerTransactionsUseCase();

    const result = await useCase.execute(consumerId);

    return response.status(200).json(result);
  }
}
