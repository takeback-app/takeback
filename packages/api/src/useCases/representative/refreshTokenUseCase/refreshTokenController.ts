import { Request, Response } from "express";

import { RefreshTokenUseCase } from "./refreshTokenUseCase";

class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const { refreshToken } = request.params;
    const useCase = new RefreshTokenUseCase();

    const result = await useCase.execute(refreshToken);

    return response.status(200).json(result);
  }
}

export { RefreshTokenController };
