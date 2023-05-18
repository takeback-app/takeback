import { Consumer } from "@prisma/client";
import { redis } from "../../redis";
import { maskCPF } from "../../utils/Masks";

export class GenerateUserCacheUseCase {
  async execute(consumer: Consumer, companyId: string) {
    const cpf = consumer.cpf.replace(/\D/g, "");

    await redis.set(
      `autocomplete:${companyId}:${cpf}`,
      `${maskCPF(cpf)} - ${consumer.fullName}`
    );
  }
}
