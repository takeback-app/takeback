import { Request, Response } from "express";
import { SignInRepresentativeUseCase } from "../../useCases/representative/SignInRepresentativeUseCase";

export class AuthController {
  async signIn(request: Request, response: Response) {
    const { password, cpf } = request.body;

    const useCase = new SignInRepresentativeUseCase();

    const result = await useCase.handle({
      password,
      cpf,
    });

    return response.status(200).json(result);
  }
}
