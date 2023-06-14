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

    const { identifier } = request.body;

    const alreadyExistReferral = await prisma.referral.findFirst({
      where: { identifier },
    });

    if (alreadyExistReferral) {
      return response.status(400).json({ message: "Cliente já indicado" });
    }

    const consumerReferralCount = await prisma.referral.count({
      where: { consumerId, status: "WAITING" },
    });

    if (consumerReferralCount >= 10) {
      return response
        .status(400)
        .json({ message: "Limite de indicações atingido" });
    }

    const alreadyExistConsumer = await prisma.consumer.findFirst({
      where: { phone: identifier },
    });

    if (alreadyExistConsumer) {
      return response.status(400).json({ message: "Cliente já cadastrado" });
    }

    const referral = await prisma.referral.create({
      data: { identifier, consumerId },
    });

    return response.status(201).json(referral);
  }

  async delete(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const { id } = request.params;

    await prisma.referral.deleteMany({
      where: { id, consumerId, status: "WAITING" },
    });

    return response.status(204).json();
  }
}
