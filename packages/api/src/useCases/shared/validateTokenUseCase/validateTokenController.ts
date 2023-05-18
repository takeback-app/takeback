import { Request, Response } from "express";
import { ValidateTokenUseCase } from "./validateTokenUseCase";

export class ValidateTokenController {
  async handle(request: Request, response: Response) {
    const authHeader = request.headers.authorization;

    const useCase = new ValidateTokenUseCase();

    const result = await useCase.execute({ token: authHeader });

    return response.status(200).json(result);
  }
}
