import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { InternalError } from "../../config/GenerateErros";
import { GetRepresentative } from "../../useCases/representative/GetRepresentativeUseCase";

export class RaffleController {
  async index(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const { whereCondominiumFilter } = await GetRepresentative.handle(id);

    const raffles = await prisma.raffle.findMany({
      where: { company: whereCondominiumFilter },
      include: {
        status: true,
        _count: { select: { items: true, tickets: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return response.status(200).json(raffles);
  }

  async show(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { id } = request.params;

    const raffle = await prisma.raffle.findFirst({
      where: { id, companyId },
      include: {
        items: {
          orderBy: { order: "asc" },
          include: {
            raffleItemDelivery: {
              include: { companyUser: { select: { name: true } } },
            },
            winnerTicket: {
              select: {
                consumer: {
                  select: { fullName: true, cpf: true, phone: true },
                },
              },
            },
          },
        },
        status: true,
      },
    });

    if (!raffle) {
      throw new InternalError("Sorteio não encontrado", 400);
    }

    const consumers = await prisma.consumer.findMany({
      where: {
        raffleTickets: {
          some: { raffleId: raffle.id, status: { not: "CANCELED" } },
        },
      },
      select: {
        id: true,
        fullName: true,
        cpf: true,
        _count: {
          select: {
            raffleTickets: {
              where: { raffleId: raffle.id, status: { not: "CANCELED" } },
            },
          },
        },
      },
    });

    return response.json({ ...raffle, consumers });
  }
}
