import { Request, Response } from "express";
import { ValidateUserPasswordUseCase } from "./companyCashback/ValidateUserPasswordUseCase";
import { prisma } from "../../prisma";
import { InternalError } from "../../config/GenerateErros";
import { ApproveSolicitationUseCase } from "../../useCases/cashback/ApproveSolicitationUseCase";
import { solicitationKey } from "../../services/cacheKeys";
import { Cache } from "../../redis";

export class SolicitationController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const solicitations = await prisma.transactionSolicitation.findMany({
      where: { companyId, status: "WAITING" },
      orderBy: { createdAt: "desc" },
      include: {
        consumer: { select: { fullName: true } },
        companyPaymentMethod: {
          select: {
            id: true,
            paymentMethod: { select: { description: true } },
          },
        },
      },
    });

    return response.json(solicitations);
  }

  async approve(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { companyUserPassword, solicitationsId } = request.body;

    const validateUserPassword = new ValidateUserPasswordUseCase();

    const companyUser = await validateUserPassword.findCompanyUserByPassword(
      companyId,
      companyUserPassword
    );

    const solicitations = await prisma.transactionSolicitation.findMany({
      where: {
        id: { in: solicitationsId },
        companyId: companyId,
        consumer: { cpf: { not: companyUser.cpf } },
      },
    });

    if (solicitations.length != solicitationsId.length) {
      throw new InternalError(
        "Não é possível aprovar solicitações gerados por si mesmo.",
        400
      );
    }

    const approveUseCase = new ApproveSolicitationUseCase();

    for (const solicitation of solicitations) {
      await approveUseCase.execute(solicitation, companyUser.id);
    }

    await Cache.forget(solicitationKey(companyId));

    return response.status(204).json();
  }

  async reprove(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { companyUserPassword, solicitationsId, reason } = request.body;

    const validateUserPassword = new ValidateUserPasswordUseCase();

    const companyUser = await validateUserPassword.findCompanyUserByPassword(
      companyId,
      companyUserPassword
    );

    await prisma.transactionSolicitation.updateMany({
      where: { id: { in: solicitationsId }, companyId: companyId },
      data: {
        status: "CANCELED",
        updatedAt: new Date(),
        companyUserId: companyUser.id,
        text: reason,
      },
    });

    await Cache.forget(solicitationKey(companyId));

    return response.status(204).json();
  }

  async count(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const cacheKey = solicitationKey(companyId);

    const value = await Cache.rememberForever<number>(cacheKey, async () => {
      return prisma.transactionSolicitation.count({
        where: {
          companyId,
          status: "WAITING",
        },
      });
    });

    return response.json({ count: value });
  }
}
