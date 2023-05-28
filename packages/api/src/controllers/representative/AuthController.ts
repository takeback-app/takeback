import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { SignInRepresentativeUseCase } from "../../useCases/representative/SignInRepresentativeUseCase";
import { InternalError } from "../../config/GenerateErros";
import { prisma } from "../../prisma";

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

  async updatePassword(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { password, newPassword } = request.body;

    if (!password || !newPassword) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await prisma.representativeUser.findFirst({
      where: { id },
      select: { id: true, password: true },
    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InternalError("Senha incorreta", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    await prisma.representativeUser.update({
      where: { id },
      data: { password: newPasswordEncrypted },
    });

    return response.status(200).json({ message: "Senha atualizada!" });
  }
}
