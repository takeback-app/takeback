import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { InternalError } from "../../../config/GenerateErros";

const PER_PAGE = 60;

export class WithDrawController {
  async index(request: Request, response: Response) {
    const pageQuery = request.query.page;

    const page = Number(pageQuery) || 1;

    const withdrawOrders = await prisma.withdrawOrder.findMany({
      include: {
        company: {
          select: {
            id: true,
            fantasyName: true,
          },
        },
        representative: {
          select: {
            id: true,
            fantasyName: true,
          },
        },
        status: true,
      },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    const count = await prisma.withdrawOrder.count();

    return response.json({
      data: withdrawOrders,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const withdrawOrder = await prisma.withdrawOrder.findUnique({
      where: { id },
      include: {
        company: true,
        representative: true,
        status: true,
      },
    });

    if (!withdrawOrder) {
      throw new InternalError("Saque não encontrada", 400);
    }

    return response.json(withdrawOrder);
  }

  async approve(request: Request, response: Response) {
    const { id } = request.params;

    const withdrawOrder = await prisma.withdrawOrder.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!withdrawOrder) {
      throw new InternalError("Saque não encontrada", 400);
    }

    const { company } = withdrawOrder;

    if (+withdrawOrder.value > +company.positiveBalance) {
      throw new InternalError(
        "Não é possível fazer saque de um valor maior do que se tem em conta",
        403
      );
    }

    const paidStatus = await prisma.withdrawOrderStatus.findFirst({
      where: { description: "Pago" },
    });

    if (!paidStatus) {
      throw new InternalError(
        "Sistema não configurado. Contate um administrador",
        400
      );
    }

    await prisma.company.update({
      where: { id: withdrawOrder.companyId },
      data: {
        positiveBalance: company.positiveBalance.sub(withdrawOrder.value),
      },
    });

    await prisma.withdrawOrder.update({
      where: { id },
      data: {
        statusId: paidStatus.id,
        approvedAt: new Date(),
      },
    });

    return response
      .status(200)
      .json({ message: "Saque aprovado com sucesso!" });
  }

  async cancel(request: Request, response: Response) {
    const { id } = request.params;

    const withdrawOrder = await prisma.withdrawOrder.findUnique({
      where: { id },
    });

    if (!withdrawOrder) {
      throw new InternalError("Saque não encontrada", 400);
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
