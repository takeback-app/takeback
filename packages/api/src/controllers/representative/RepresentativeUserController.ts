import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { InternalError } from "../../config/GenerateErros";
import { GetRepresentative } from "../../useCases/representative/GetRepresentativeUseCase";

const PER_PAGE = 25;

export class RepresentativeUserController {
  async index(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const users = await prisma.representativeUser.findMany({
      where: { representativeId },
    });

    return response.status(200).json({
      data: users,
    });
  }

  // async show(request: Request, response: Response) {
  //   const { id } = request.params;

  //   const raffle = await prisma.raffle.findFirst({
  //     where: { id },
  //     include: {
  //       status: true,
  //       company: { select: { fantasyName: true } },
  //       items: {
  //         orderBy: { order: "asc" },
  //         include: {
  //           raffleItemDelivery: {
  //             include: { companyUser: { select: { name: true } } },
  //           },
  //           winnerTicket: {
  //             select: {
  //               consumer: {
  //                 select: { fullName: true, cpf: true, phone: true },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!raffle) {
  //     throw new InternalError("Sorteio não encontrado", 400);
  //   }

  //   const consumers = await prisma.consumer.findMany({
  //     where: {
  //       raffleTickets: {
  //         some: { raffleId: raffle.id, status: { not: "CANCELED" } },
  //       },
  //     },
  //     select: {
  //       id: true,
  //       fullName: true,
  //       cpf: true,
  //       _count: {
  //         select: {
  //           raffleTickets: {
  //             where: {
  //               raffleId: raffle.id,
  //               status: { not: "CANCELED" },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   return response.json({ ...raffle, consumers });
  // }
}
