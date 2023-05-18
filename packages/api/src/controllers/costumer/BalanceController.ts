import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { InternalError } from "../../config/GenerateErros";

export class BalanceController {
  async freeBalance(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];

    const consumer = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
    });
    const solicitations = await prisma.transactionSolicitation.aggregate({
      where: { status: "WAITING", type: "PAYMENT", consumerId: consumer.id },
      _sum: { valueInCents: true },
    });

    const balanceInCents = Math.floor(+consumer.balance * 100);

    const freeBalance = balanceInCents - solicitations._sum.valueInCents;

    return response.json({ freeBalance: freeBalance / 100 });
  }

  async validate(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];
    const { purchaseValueInCents } = request.body;

    const consumer = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
    });

    const solicitations = await prisma.transactionSolicitation.aggregate({
      where: { status: "WAITING", type: "PAYMENT", consumerId: consumer.id },
      _sum: { valueInCents: true },
    });

    const newBalanceInCents =
      Number(purchaseValueInCents) + solicitations._sum.valueInCents;

    // É necessário comparar os valores em centavos para evitar erros de arredondamento.
    const balanceInCents = Math.floor(+consumer.balance * 100);

    if (newBalanceInCents > balanceInCents) {
      throw new InternalError(`Saldo insuficiente.`, 400);
    }

    return response.status(204).json();
  }
}
