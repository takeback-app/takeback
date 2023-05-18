import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { InternalError } from "../../../config/GenerateErros";

export class WithDrawController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const withdrawOrders = await prisma.withdrawOrder.findMany({
      include: {
        status: true,
      },
      where: { companyId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return response.json(withdrawOrders);
  }

  async store(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { value, pixKey } = request.body;

    if (Number(value) < 100) {
      throw new InternalError(
        "Não é possível fazer saque de um valor menor do que de R$100,00",
        403
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    const pendingStatus = await prisma.withdrawOrderStatus.findFirst({
      where: { description: "Saque solicitado" },
    });

    if (!pendingStatus) {
      throw new InternalError(
        "Sistema não configurado. Contate um administrador",
        400
      );
    }

    const valueNumber = Number(value);

    if (valueNumber > +company.positiveBalance) {
      throw new InternalError(
        "Não é possível fazer saque de um valor maior do que se tem em conta",
        403
      );
    }

    const withdrawSum = await prisma.withdrawOrder.aggregate({
      where: {
        companyId: company.id,
        statusId: pendingStatus.id,
      },
      _sum: {
        value: true,
      },
    });

    if (+withdrawSum._sum.value + valueNumber > +company.positiveBalance) {
      throw new InternalError(
        "Você já possui pedidos de saque que no total passam do seu valor em saldo",
        403
      );
    }

    const withdrawOrder = await prisma.withdrawOrder.create({
      data: {
        value,
        pixKey,
        companyId: company.id,
        statusId: pendingStatus.id,
      },
    });

    return response.status(201).json(withdrawOrder);
  }

  async cancel(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { id } = request.params;

    const withdrawOrder = await prisma.withdrawOrder.findFirst({
      where: { id, companyId },
      include: { status: true },
    });

    if (!withdrawOrder) {
      throw new InternalError("Saque não encontrada", 400);
    }

    if (withdrawOrder.status.description !== "Saque solicitado") {
      throw new InternalError(
        "Não é possível cancelar saque já pago ou cancelado",
        400
      );
    }

    const cancelStatus = await prisma.withdrawOrderStatus.findFirst({
      where: { description: "Cancelado" },
    });

    if (!cancelStatus) {
      throw new InternalError(
        "Sistema não configurado. Contate um administrador",
        400
      );
    }

    await prisma.withdrawOrder.update({
      where: { id },
      data: {
        statusId: cancelStatus.id,
      },
    });

    return response
      .status(200)
      .json({ message: "Saque cancelado com sucesso!" });
  }
}
