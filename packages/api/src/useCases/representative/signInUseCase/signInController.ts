import { Request, Response } from "express";
import { SignInUseCase } from "./signInUseCase";

class SignInController {
  async handle(request: Request, response: Response) {
    const body = request.body;
    const useCase = new SignInUseCase();

    const result = await useCase.execute(body);

    return response.status(200).json(result);
  }
}

export { SignInController };
