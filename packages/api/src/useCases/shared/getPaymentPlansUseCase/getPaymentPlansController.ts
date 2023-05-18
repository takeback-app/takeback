import { Request, Response } from "express";
import { GetPaymentPlansUseCase } from "./getPaymentPlansUseCase";

export class GetPaymentPlansController {
  async handle(request: Request, response: Response) {
    const useCase = new GetPaymentPlansUseCase();

    const paymentPlans = await useCase.execute();

    return response.status(200).json(paymentPlans);
  }
}
