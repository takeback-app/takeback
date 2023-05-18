import { isCPF } from "brazilian-values";
import { InternalError } from "../../config/GenerateErros";
import { prisma } from "../../prisma";
import crypto from "node:crypto";
import bcrypt from "bcrypt";

export class PlaceholderConsumer {
  public static async create(cpf: string) {
    if (!isCPF(cpf)) throw new InternalError("CPF inválido", 400);

    const consumerId = crypto.randomInt(0, 1000000).toString().padStart(6, "0");

    return prisma.consumer.create({
      data: {
        isPlaceholderConsumer: true,
        cpf,
        email: `${consumerId}@takeback.com.br`,
        fullName: `Novo Cliente`,
        password: await bcrypt.hash(consumerId, 10),
      },
    });
  }
}
