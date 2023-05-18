import { Request, Response } from "express";
import { AuthorizePurchaseUseCase } from "./authorizePurchaseUseCase";

export class AuthorizePurchaseController {
  async handle(request: Request, response: Response) {
    const costumerId = request["tokenPayload"].id;

    const { password, value } = request.body;

    const useCase = new AuthorizePurchaseUseCase();

    const result = await useCase.execute({ costumerId, password, value });

    return response.status(200).json(result);
  }
}
