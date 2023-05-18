import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { RaffleStatusEnum } from "../../../enum/RaffleStatusEnum";

export class RaffleController {
  async ongoing(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const consumerAddress = await prisma.consumerAddress.findFirst({
      where: { consumer: { id: consumerId } },
      select: { cityId: true },
    });

    const raffles = await prisma.raffle.findMany({
      where: {
        status: { description: RaffleStatusEnum.APPROVED },
        company: { companyAddress: { cityId: consumerAddress.cityId } },
        // OR: [
        //   { tickets: { none: { consumerId } } },
        //   {
        //     tickets: {
        //       every: { consumerId, status: { in: ["CANCELED", "PENDING"] } },
        //     },
        //   },
        // ],
      },
      orderBy: { drawDate: "asc" },
      include: { company: { select: { fantasyName: true } } },
    });

    return response.json(raffles);
  }

  async finished(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const raffles = await prisma.raffle.findMany({
      where: {
        status: {
          description: {
            in: [
              RaffleStatusEnum.FINISHED,
              RaffleStatusEnum.PENDING_FINISHED,
              RaffleStatusEnum.DELIVERING,
              RaffleStatusEnum.CANCELED_FOR_NON_COMPLIANCE,
            ],
          },
        },
        tickets: {
          some: { consumerId, status: { notIn: ["CANCELED", "PENDING"] } },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        company: { select: { fantasyName: true } },
        _count: {
          select: {
            tickets: {
              where: { consumerId, status: { notIn: ["CANCELED", "PENDING"] } },
            },
            items: {
              where: {
                winnerTicket: { consumerId },
              },
            },
          },
        },
      },
    });

    return response.json(raffles);
  }

  async participating(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const raffles = await prisma.raffle.findMany({
      where: {
        status: { description: RaffleStatusEnum.APPROVED },
        tickets: {
          some: { consumerId, status: { notIn: ["CANCELED", "PENDING"] } },
        },
      },
      orderBy: { drawDate: "asc" },
      include: {
        company: { select: { fantasyName: true } },
        _count: {
          select: {
            tickets: {
              where: { consumerId, status: { notIn: ["CANCELED", "PENDING"] } },
            },
          },
        },
      },
    });

    return response.json(raffles);
  }

  async show(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    const { id } = request.params;

    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        status: { select: { description: true } },
        items: {
          orderBy: { order: "asc" },
          include: {
            raffleItemDelivery: true,
            winnerTicket: {
              select: {
                number: true,
                consumer: { select: { fullName: true, cpf: true } },
              },
            },
          },
        },
        company: {
          select: {
            fantasyName: true,
            companyAddress: { select: { city: { select: { name: true } } } },
          },
        },
        _count: {
          select: {
            tickets: { where: { consumerId, status: { not: "CANCELED" } } },
          },
        },
      },
    });

    return response.json(raffle);
  }
}
