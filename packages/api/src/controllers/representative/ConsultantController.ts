import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../../prisma";

import { CPFValidate } from "../../utils/CPFValidate";
import { InternalError } from "../../config/GenerateErros";

export class ConsultantController {
  async index(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const users = await prisma.representativeUser.findMany({
      where: { representativeId },
    });

    return response.json(users);
  }

  async store(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const {
      cpf,
      name,
      birthDay,
      birthMonth,
      birthYear,
      email,
      phone,
      password,
    } = request.body;

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF Inválido", 400);
    }

    if (!password || password.length < 4) {
      throw new InternalError("Senha inválida", 400);
    }

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const representativeUser = await prisma.representativeUser.create({
      data: {
        representativeId,
        password: passwordEncrypted,
        cpf,
        name,
        isActive: true,
        birthDay,
        birthMonth,
        birthYear,
        email,
        phone,
        role: "CONSULTANT",
      },
    });

    return response.json(representativeUser);
  }

  async update(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const { id } = request.params;

    const {
      cpf,
      name,
      birthDay,
      birthMonth,
      birthYear,
      email,
      phone,
      password,
    } = request.body;

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF Inválido", 400);
    }

    if (!password || password.length < 4) {
      throw new InternalError("Senha inválida", 400);
    }

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const representativeUser = await prisma.representativeUser.update({
      where: { id },
      data: {
        representativeId,
        password: passwordEncrypted,
        cpf,
        name,
        isActive: true,
        birthDay,
        birthMonth,
        birthYear,
        email,
        phone,
        role: "CONSULTANT",
      },
    });

    return response.json(representativeUser);
  }
}
