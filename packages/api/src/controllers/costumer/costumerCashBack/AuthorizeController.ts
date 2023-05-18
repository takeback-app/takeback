import { Request, Response } from "express";

import bcrypt from "bcrypt";

import { prisma } from "../../../prisma";
import { InternalError } from "../../../config/GenerateErros";

export async function authorize(request: Request, response: Response) {
  const consumerId = request["tokenPayload"].id;

  const { password } = request.body;

  const consumer = await prisma.consumer.findUnique({
    where: { id: consumerId },
  });

  const passwordMatch = await bcrypt.compare(password, consumer.password);

  if (!passwordMatch) {
    throw new InternalError("Senha incorreta. Por favor, tente novamente", 400);
  }

  response.status(200).json({ message: "Senha ok" });
}
