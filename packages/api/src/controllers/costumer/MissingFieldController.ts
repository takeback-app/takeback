import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { Cache } from "../../redis";

export class MissingFieldController {
  async index(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const consumer = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
      select: {
        sex: true,
        birthDate: true,
        monthlyIncomeId: true,
        maritalStatus: true,
        schooling: true,
        phone: true,
      },
    });

    const fields = Object.keys(consumer).filter(
      (key) => consumer[key] === null
    );

    return response.json({ fields });
  }

  async monthlyIncomes(_request: Request, response: Response) {
    const monthlyIncomes = await Cache.rememberForever("monthlyIncomes", () =>
      prisma.monthlyIncome.findMany()
    );

    return response.json(monthlyIncomes);
  }
}
