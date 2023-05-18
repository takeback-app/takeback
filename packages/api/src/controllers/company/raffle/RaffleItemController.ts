import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { InternalError } from "../../../config/GenerateErros";
import { RaffleStatusEnum } from "../../../enum/RaffleStatusEnum";

export class RaffleItemController {
  async confirmDelivery(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const { id } = request.params;
    const { userCode } = request.body;

    const delivery = await prisma.raffleItemDelivery.findFirst({
      where: {
        raffleItemId: id,
        item: {
          raffle: {
            companyId,
            status: { description: RaffleStatusEnum.DELIVERING },
          },
        },
        deliveredAt: null,
      },
      include: { item: true },
    });

    if (!delivery) {
      throw new InternalError(
        "O ganhador do prêmio não iniciou a retirada. Aguarde até que ele inicie para confirmar a entrega",
        400
      );
    }

    if (!delivery.item.winnerTicketId) {
      throw new InternalError("Prêmio sem ganhador", 400);
    }

    if (delivery.userCode !== userCode) {
      throw new InternalError("Código de retirada invalido", 400);
    }

    await prisma.raffleItemDelivery.update({
      where: { id: delivery.id },
      data: { deliveredAt: new Date(), companyUserId: userId },
    });

    const notDeliveredItensCount = await prisma.raffleItem.count({
      where: {
        raffleId: delivery.item.raffleId,
        OR: [
          { raffleItemDelivery: { deliveredAt: null } },
          { raffleItemDelivery: { is: null } },
        ],
      },
    });

    const wasLastItemToDeliver = notDeliveredItensCount === 0;

    if (wasLastItemToDeliver) {
      const finishedStatus = await prisma.raffleStatus.findFirst({
        where: { description: RaffleStatusEnum.FINISHED },
      });

      if (!finishedStatus) {
        throw new InternalError(
          "Sistema não configurado. Procure um administrador",
          400
        );
      }

      await prisma.raffle.update({
        where: { id: delivery.item.raffleId },
        data: { statusId: finishedStatus.id },
      });
    }

    return response
      .status(200)
      .json({ message: "Prêmio entregue com sucesso." });
  }
}
