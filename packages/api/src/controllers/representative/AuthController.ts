import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { SignInRepresentativeUseCase } from "../../useCases/representative/SignInRepresentativeUseCase";
import { InternalError } from "../../config/GenerateErros";

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

  async verifyToken(request: Request, response: Response) {
    const token = request.headers.authorization;

    if (!token) {
      throw new InternalError("Token inválido", 498);
    }

    const parts = token.split(" ");

    if (parts.length !== 2) {
      throw new InternalError("Token inválido", 498);
    }

    const [schema, value] = parts;

    if (!/^Bearer$/i.test(schema)) {
      throw new InternalError("Token inválido", 498);
    }

    const payload = jwt.verify(
      value,
      process.env.JWT_PRIVATE_KEY,
      (err, decoded) => {
        if (err) {
          throw new InternalError("Token inválido", 498);
        }

        return decoded;
      }
    );

    return response.status(200).json(payload);
  }
}
