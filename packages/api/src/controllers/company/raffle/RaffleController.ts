import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { RaffleStatusEnum } from "../../../enum/RaffleStatusEnum";
import { InternalError } from "../../../config/GenerateErros";
import { CreateRaffleRequest } from "../../../requests/CreateRaffleRequest";
import { UpdateRaffleRequest } from "../../../requests/UpdateRaffleRequest";
import { ValidateNumberOfMonthlyRafflesUseCase } from "../../../useCases/raffle/ValidateNumberOfMonthlyRafflesUseCase";
import { DateTime } from "luxon";
import { UpdateOrCreateRaffleItemsUseCase } from "../../../useCases/raffle/UpdateOrCreateRaffleItemsUseCase";
import { DrawRaffleUseCase } from "../../../useCases/raffle/DrawRaffleUseCase";
import { TransactionStatusEnum } from "../../../enum/TransactionStatusEnum";
import { Notify } from "../../../notifications";
import { NewRaffleToApprove } from "../../../notifications/NewRaffleToApprove";

const validateNumberOfMonthlyRaffles =
  new ValidateNumberOfMonthlyRafflesUseCase();

const updateOrCreateRaffleItemsUseCase = new UpdateOrCreateRaffleItemsUseCase();

export class RaffleController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const raffles = await prisma.raffle.findMany({
      where: { companyId },
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

  async store(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"] as { companyId: string };

    await validateNumberOfMonthlyRaffles.execute(companyId);

    const form = CreateRaffleRequest.safeParse(request.body);

    if (!form.success) {
      throw new InternalError("Existem erros nos dados enviados.", 422);
    }

    if (form.data.items.length === 0 || form.data.items.length > 20) {
      throw new InternalError(
        "Deve ter pelo menos 1 prêmio e no máximo 20.",
        400
      );
    }

    const isDrawDateInPast =
      new Date(form.data.drawDate) <
      DateTime.now().minus({ hours: 3 }).startOf("day").toJSDate();

    if (isDrawDateInPast) {
      throw new InternalError(
        "Não é possível criar sorteio com data passada.",
        422
      );
    }

    const waitingStatus = await prisma.raffleStatus.findFirst({
      where: { description: RaffleStatusEnum.WAITING },
    });

    if (!waitingStatus) {
      throw new InternalError(
        "Sistema não configurado. Procure um administrador",
        400
      );
    }

    const { items, drawDate, ...rest } = form.data;

    const raffle = await prisma.raffle.create({
      data: {
        title: rest.title,
        imageUrl: rest.imageUrl,
        ticketValue: rest.ticketValue,
        pickUpLocation: rest.pickUpLocation,
        isOpenToOtherCompanies: rest.isOpenToOtherCompanies,
        isOpenToEmployees: rest.isOpenToEmployees,
        drawDate: DateTime.fromISO(drawDate).plus({ hours: 3 }).toISO(),
        companyId,
        statusId: waitingStatus.id,
      },
    });

    await updateOrCreateRaffleItemsUseCase.execute(raffle.id, items);

    const users = await prisma.takebackUser.findMany({
      select: { id: true },
      where: { userTypeId: 2 },
    });

    const company = await prisma.company.findFirst({
      where: { id: companyId },
    });

    Notify.sendMany(
      users,
      new NewRaffleToApprove(raffle.id, company.fantasyName)
    );

    return response.status(201).json(raffle);
  }

  async update(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { id } = request.params;

    const raffle = await prisma.raffle.findFirst({
      where: { id, companyId },
      select: { id: true, statusId: true },
    });

    if (!raffle) {
      throw new InternalError("Sorteio não encontrado", 400);
    }

    const form = UpdateRaffleRequest.safeParse(request.body);

    if (!form.success) {
      throw new InternalError("Existem erros nos dados enviados.", 422);
    }

    if (form.data.items.length === 0 || form.data.items.length > 20) {
      throw new InternalError(
        "Deve ter pelo menos 1 prêmio e no máximo 20.",
        400
      );
    }

    const isDrawDateInPast =
      new Date(form.data.drawDate) <
      DateTime.now().minus({ hours: 3 }).startOf("day").toJSDate();

    if (isDrawDateInPast) {
      throw new InternalError(
        "Não é possível criar sorteio com data passada.",
        422
      );
    }

    const waitingStatus = await prisma.raffleStatus.findFirst({
      where: { description: RaffleStatusEnum.WAITING },
    });

    if (!waitingStatus) {
      throw new InternalError(
        "Sistema não configurado. Procure um administrador",
        400
      );
    }

    if (raffle.statusId !== waitingStatus.id) {
      throw new InternalError(
        "Não é possível editar um sorteio já aprovado.",
        400
      );
    }

    const { items, drawDate, ...rest } = form.data;

    await prisma.raffle.update({
      where: { id: raffle.id },
      data: {
        ...rest,
        drawDate: DateTime.fromISO(drawDate).plus({ hours: 3 }).toISO(),
      },
    });

    await updateOrCreateRaffleItemsUseCase.execute(raffle.id, items);

    return response.status(200).json({ message: "Atualizado com sucesso." });
  }

  async cancel(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { id } = request.params;

    const raffle = await prisma.raffle.findFirst({
      where: {
        id,
        companyId,
        status: { description: RaffleStatusEnum.WAITING },
      },
      select: { id: true },
    });

    if (!raffle) {
      throw new InternalError("Sorteio não encontrado", 400);
    }

    const cancelStatus = await prisma.raffleStatus.findFirst({
      where: { description: RaffleStatusEnum.CANCELED },
    });

    if (!cancelStatus) {
      throw new InternalError(
        "Sistema não configurado. Procure um administrador",
        400
      );
    }

    await prisma.raffle.update({
      where: { id: raffle.id },
      data: {
        statusId: cancelStatus.id,
      },
    });

    return response.json({ message: "Sorteio cancelado" });
  }

  async monthlyRemaining(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { numberMaxOfMonthlyRaffles, numberOfRaffleThisMonth } =
      await validateNumberOfMonthlyRaffles.getCount(companyId);

    return response.json({
      monthlyRemaining: numberMaxOfMonthlyRaffles - numberOfRaffleThisMonth,
    });
  }

  async draw(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { id } = request.params;

    const pendingTransactions = await prisma.transaction.count({
      where: {
        companiesId: companyId,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.NOT_PAID,
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.PROCESSING,
            ],
          },
        },
      },
    });

    if (pendingTransactions) {
      throw new InternalError(
        "Não é possível realizar sorteios com cashbacks pendentes. Pague todos e tente sortear novamente.",
        400
      );
    }

    const raffle = await prisma.raffle.findFirst({
      where: {
        id,
        companyId,
        status: { description: RaffleStatusEnum.APPROVED },
        drawDate: { lte: new Date() },
      },
      include: {
        items: { orderBy: { order: "asc" } },
        company: { select: { fantasyName: true } },
      },
    });

    if (!raffle) {
      throw new InternalError("Não foi possível sortear ainda.", 400);
    }

    const deliveringStatus = await prisma.raffleStatus.findFirst({
      where: { description: RaffleStatusEnum.DELIVERING },
    });

    if (!deliveringStatus) {
      throw new InternalError(
        "Sistema não configurado. Procure um administrador",
        400
      );
    }

    const useCase = new DrawRaffleUseCase();

    await useCase.execute(raffle);

    await prisma.raffle.update({
      where: { id: raffle.id },
      data: { statusId: deliveringStatus.id },
    });

    return response.status(204).json();
  }
}
