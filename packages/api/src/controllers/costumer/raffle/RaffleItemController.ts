import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { InternalError } from "../../../config/GenerateErros";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";

export class RaffleItemController {
  async delivery(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;
    const { id } = request.params;

    const delivery = await prisma.raffleItemDelivery.upsert({
      where: { raffleItemId: id },
      update: {},
      create: {
        raffleItemId: id,
        userCode: String(generateRandomNumber(1000, 9999)),
      },
      include: {
        item: {
          include: {
            winnerTicket: {
              select: {
                consumerId: true,
              },
            },
          },
        },
      },
    });

    if (delivery.item.winnerTicket.consumerId !== consumerId) {
      throw new InternalError("Você não é o ganhador desse prêmio.", 400);
    }

    if (delivery.deliveredAt) {
      throw new InternalError("Prêmio já entregue", 400);
    }

    return response.json({ code: delivery.userCode });
  }
}
