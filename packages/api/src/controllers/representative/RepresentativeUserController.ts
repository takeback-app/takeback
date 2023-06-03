import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { InternalError } from "../../config/GenerateErros";
import { DateTime } from "luxon";

export class ConsultantController {
  async index(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const users = await prisma.representativeUser.findMany({
      where: { representativeId, role: "CONSULTANT" },
      select: {
        name: true,
        cpf: true,
        email: true,
        phone: true,
        birthDay: true,
        birthMonth: true,
        birthYear: true,
      },
    });

    return response.status(200).json({
      data: users,
    });
  }

  async store(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const user = request.body;

    const userExists = await prisma.representativeUser.findFirst({
      where: { cpf: user.cpf },
    });

    if (userExists) {
      throw new InternalError("Representante (CPF) já cadastrado", 400);
    }

    const userBirthday = DateTime.fromISO(user.birthday);
    const userPassword = await bcrypt.hash(user.password, 8);

    await prisma.representativeUser.create({
      data: {
        representativeId,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        password: userPassword,
        phone: user.phone,
        role: "CONSULTANT",
        birthDay: userBirthday.day,
        birthMonth: userBirthday.month,
        birthYear: userBirthday.year,
      },
    });

    return response
      .status(201)
      .json({ message: "Consultor cadastrado com sucesso" });
  }

  async update(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const { id } = request.params;

    const user = request.body;

    const userBirthday = DateTime.fromISO(user.birthday);

    const userPassword = user.password
      ? await bcrypt.hash(user.password, 8)
      : undefined;

    await prisma.representativeUser.updateMany({
      where: { representativeId: id, role: "ADMIN" },
      data: {
        representativeId,
        cpf: user.cpf,
        name: user.name,
        email: user.email,
        password: userPassword,
        phone: user.phone,
        role: "CONSULTANT",
        birthDay: userBirthday.day,
        birthMonth: userBirthday.month,
        birthYear: userBirthday.year,
      },
    });

    return response.json({ message: "Consultor atualizado com sucesso" });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.representativeUserCompany.deleteMany({
      where: { representativeUserId: id },
    });

    await prisma.representativeUser.delete({
      where: { id },
    });

    return response.json({ message: "Consultor deletado" });
  }

  async deactivate(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.representativeUser.updateMany({
      where: { id },
      data: { isActive: false },
    });

    await prisma.representativeUserCompany.deleteMany({
      where: { representativeUserId: id },
    });

    return response.json({ message: "Consultor desativado" });
  }
}
