import { Request, Response } from "express";
import { ForgotPasswordUseCase } from "./forgotPasswordUseCase";

class ForgotPasswordController {
  async handle(request: Request, response: Response) {
    const body = request.body;
    const useCase = new ForgotPasswordUseCase();

    const result = await useCase.execute(body);

    return response.status(200).json(result);
  }
}

export { ForgotPasswordController };
