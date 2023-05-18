import { Request, Response } from "express";
import { GetConsumerTransactionDetailsUseCase } from "./getConsumerTransactionDetailsUseCase";

export class GetConsumerTransactionDetailsController {
  async handle(request: Request, response: Response) {
    const transactionId = request.params.id;

    const useCase = new GetConsumerTransactionDetailsUseCase();

    const result = await useCase.execute(transactionId);

    return response.status(200).json(result);
  }
}
