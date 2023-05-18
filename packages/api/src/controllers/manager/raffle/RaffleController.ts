import { Request, Response } from "express";
import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";
import { NotifyNewRaffleUseCase } from "../../../useCases/raffle/NotifyNewRaffleUseCase";

const PER_PAGE = 25;

export class RaffleController {
  async index(request: Request, response: Response) {
    const pageQuery = request.query.page;

    const page = Number(pageQuery) || 1;

    const raffles = await prisma.raffle.findMany({
      select: {
        id: true,
        title: true,
        drawDate: true,
        createdAt: true,
        status: true,
        company: {
          select: {
            fantasyName: true,
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    const count = await prisma.raffle.count();

    return response.json({
      data: raffles,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const raffle = await prisma.raffle.findUnique({
      where: { id },
      include: {
        status: true,
        company: { select: { fantasyName: true } },

        items: {
          orderBy: { order: "asc" },
          include: {
            raffleItemDelivery: {
              include: { companyUser: { select: { name: true } } },
            },
            winnerTicket: {
              select: { consumer: { select: { fullName: true, cpf: true } } },
            },
          },
        },
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

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const { statusId } = request.body;

    const raffle = await prisma.raffle.findFirst({
      where: { id },
      select: { id: true },
    });

    if (!raffle) {
      throw new InternalError("Sorteio não encontrado", 400);
    }

    const status = await prisma.raffleStatus.findFirst({
      where: { id: statusId },
    });

    if (!status) {
      throw new InternalError(
        "Sistema não configurado. Procure um administrador",
        400
      );
    }

    const updatedRaffle = await prisma.raffle.update({
      where: { id: raffle.id },
      data: { statusId: status.id },
    });

    const useCase = new NotifyNewRaffleUseCase();

    await useCase.execute(updatedRaffle);

    return response.json({ message: "Sorteio atualizado" });
  }
}
