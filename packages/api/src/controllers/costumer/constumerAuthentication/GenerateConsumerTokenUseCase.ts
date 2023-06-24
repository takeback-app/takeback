import { Consumer } from "@prisma/client";
import { prisma } from "../../../prisma";
import dayjs from "dayjs";
import { generateToken } from "../../../config/JWT";

export class GenerateConsumerTokenUseCase {
  public static async handle(consumer: Consumer) {
    await prisma.refreshToken.deleteMany({
      where: { consumerId: consumer.id },
    });

    const expiresIn = dayjs().add(45, "day").unix();

    const refreshToken = await prisma.refreshToken.create({
      data: {
        consumerId: consumer.id,
        expiresIn,
      },
    });

    const token = generateToken(
      {
        id: consumer.id,
        name: consumer.fullName,
      },
      process.env.JWT_PRIVATE_KEY,
      2592000 // 30 dias
    );

    return { token, refreshToken: refreshToken.id };
  }
}
