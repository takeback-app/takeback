import { Request, Response } from "express";
import { prisma } from "../../prisma";

export class ReferralController {
  async index(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const referrals = await prisma.referral.findMany({
      where: { consumerId },
      include: { childrenConsumer: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
    });

    return response.json(referrals);
  }

  async store(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const { cpf } = request.body;

    const alreadyExistReferral = await prisma.referral.findFirst({
      where: { cpf },
    });

    if (alreadyExistReferral) {
      return response.status(400).json({ message: "CPF já indicado" });
    }

    const alreadyExistConsumer = await prisma.consumer.findFirst({
      where: { cpf },
    });

    if (alreadyExistConsumer) {
      return response.status(400).json({ message: "CPF já cadastrado" });
    }

    const referral = await prisma.referral.create({
      data: { cpf, consumerId },
    });

    return response.status(201).json(referral);
  }
}
