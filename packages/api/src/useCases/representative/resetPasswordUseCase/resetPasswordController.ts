import { Request, Response } from "express";

import { ResetPasswordUseCase } from "./resetPasswordUseCase";

class ResetPasswordController {
  async handle(request: Request, response: Response) {
    const body = request.body;
    const useCase = new ResetPasswordUseCase();

    const result = await useCase.execute(body);

    return response.status(200).json(result);
  }
}

export { ResetPasswordController };
