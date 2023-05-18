import { Request, Response } from "express";
import { CostumerAuthorizePurchaseUseCase } from "./CostumerAuthorizePurchaseUseCase";
import { CostumerDropTransactionUseCase } from "./CostumerDropTransactionUseCase";
import { CostumerFindTransactionUseCase } from "./CostumerFindTransactionUseCase";
import { CostumerFindCashbackDetailsUseCase } from "./CostumerFindCashbackDetailsUseCase";

class CostumerCashBackController {
  async authorizePurchase(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { signature, value } = request.body;
    const authorize = new CostumerAuthorizePurchaseUseCase();

    const result = await authorize.execute({
      consumerID,
      signature,
      value,
    });

    response.status(200).json(result);
  }

  async findTransaction(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { offset, limit } = request.params;

    const find = new CostumerFindTransactionUseCase();

    const result = await find.execute({
      consumerID,
      limit,
      offset,
    });

    response.status(200).json(result);
  }

  async findCashbackDetails(request: Request, response: Response) {
    const transactionID = request.params.id;

    const findDetails = new CostumerFindCashbackDetailsUseCase();

    const result = await findDetails.execute({
      transactionID: parseInt(transactionID),
    });

    return response.status(200).json(result);
  }

  async dropTransaction(request: Request, response: Response) {
    const transactionID = request.params.id;

    const drop = new CostumerDropTransactionUseCase();

    const result = await drop.execute({
      transactionID,
    });

    response.status(200).json(result);
  }
}

export { CostumerCashBackController };
