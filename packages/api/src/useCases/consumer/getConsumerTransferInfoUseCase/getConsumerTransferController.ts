import { Request, Response } from "express";
import { GetConsumerTransferInfoUseCase } from "./getConsumerTransferInfoUseCase";

export class GetConsumerTransferController {
  async handle(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;
    const consumerCpf = request.params.cpf;

    const useCase = new GetConsumerTransferInfoUseCase();

    const result = await useCase.execute(consumerCpf, consumerId);

    return response.status(200).json(result);
  }
}
