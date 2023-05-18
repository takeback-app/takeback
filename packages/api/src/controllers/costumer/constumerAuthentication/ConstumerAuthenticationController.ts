import { Request, Response } from "express";
import { ForgotPasswordUseCase } from "./ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";
import { SignInCostumerUseCase } from "./SignInCostumerUseCase";
import { UpdateCostumerPasswordUseCase } from "./UpdateCostumerPasswordUseCase";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

class ConstumerAuthenticationController {
  async signInCostumer(request: Request, response: Response) {
    const { cpf, password } = request.body;

    const signIn = new SignInCostumerUseCase();

    const result = await signIn.execute({
      cpf,
      password,
    });

    return response.status(200).json(result);
  }

  async updateCostumerPassword(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { newPassword, password } = request.body;

    const update = new UpdateCostumerPasswordUseCase();

    const result = await update.execute({
      consumerID,
      newPassword,
      password,
    });

    return response.status(200).json(result);
  }

  async forgotPassword(request: Request, response: Response) {
    const { cpf } = request.body;

    const forgot = new ForgotPasswordUseCase();

    const message = await forgot.execute({ cpf });

    return response.status(200).json({ message });
  }

  async resetPassword(request: Request, response: Response) {
    const { token, newPassword } = request.body;

    const reset = new ResetPasswordUseCase();

    const message = await reset.execute({ newPassword, token });

    return response.status(200).json({ message });
  }

  async refreshToken(request: Request, response: Response) {
    const { refreshToken } = request.params;

    const refresh = new RefreshTokenUseCase();

    const token = await refresh.execute(refreshToken);

    return response.status(200).json(token);
  }
}

export { ConstumerAuthenticationController };
