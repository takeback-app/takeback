import { Request, Response } from "express";

import { ForgotPasswordUseCase } from "./ForgotPasswordUseCase";
import { RegisterCompanyUseCase } from "./RegisterCompanyUseCase";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";
import { SignInCompanyUseCase } from "./SignInCompanyUseCase";
import { VerifyTokenUseCase } from "./VerifyTokenUseCase";

class AuthCompanyController {
  async registerNewCompany(request: Request, response: Response) {
    const {
      industry,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    } = request.body;

    const registerCompanyUseCase = new RegisterCompanyUseCase();

    const result = await registerCompanyUseCase.execute({
      industry,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    });

    return response.status(200).json(result);
  }

  async signUserCompany(request: Request, response: Response) {
    const { password, user } = request.body;

    const signInCompany = new SignInCompanyUseCase();

    const result = await signInCompany.execute({
      password,
      user,
    });

    return response.status(200).json(result);
  }

  async verifyToken(request: Request, response: Response) {
    const token = request.headers.authorization;

    const verifyToken = new VerifyTokenUseCase();

    const result = await verifyToken.execute({ token });

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
}

export { AuthCompanyController };
