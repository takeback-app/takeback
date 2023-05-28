import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { InternalError } from "../../config/GenerateErros";
import { GetRepresentative } from "../../useCases/representative/GetRepresentativeUseCase";

const PER_PAGE = 25;

export class RaffleController {
  async index(request: Request, response: Response) {
    const pageQuery = request.query.page;
    const { id } = request["tokenPayload"];

    const page = Number(pageQuery) || 1;

    const { whereCondominiumFilter } = await GetRepresentative.handle(id);

    const raffles = await prisma.raffle.findMany({
      where: { company: whereCondominiumFilter },
      include: {
        status: true,
        _count: { select: { items: true, tickets: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    const count = await prisma.raffle.count({
      where: { company: whereCondominiumFilter },
    });

    return response.status(200).json({
      data: raffles,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const raffle = await prisma.raffle.findFirst({
      where: { id },
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
