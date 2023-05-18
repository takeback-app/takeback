import { Request, Response } from "express";
import { InternalError } from "../../config/GenerateErros";
import { prisma } from "../../prisma";
import { AudienceCountRequest } from "../../requests/AudienceCountRequest";
import { GetAudienceUseCase } from "../../useCases/notificationSolicitations/GetAudienceUseCase";
import { ValidateNumberOfMonthlyNotificationSolicitationsUseCase } from "../../useCases/notificationSolicitations/ValidateNumberOfMonthlyNotificationSolicitationsUseCase";
import { CreateNotificationSolicitationRequest } from "../../requests/CreateNotificationSolicitationRequest";

export class NotificationSolicitationController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const notificationSolicitations =
      await prisma.notificationSolicitation.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
      });

    return response.json(notificationSolicitations);
  }

  async store(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CreateNotificationSolicitationRequest.safeParse(request.body);

    if (!form.success) {
      throw new InternalError("Existem erros nos dados enviados.", 422);
    }

    const {
      audienceBalance,
      audienceSex,
      dateOfPurchase,
      hasChildren,
      maxAudienceAge,
      message,
      minAudienceAge,
      storeVisitType,
      title,
    } = form.data;

    await prisma.notificationSolicitation.create({
      data: {
        audienceBalance,
        audienceSex,
        dateOfPurchase,
        hasChildren,
        maxAudienceAge,
        message,
        minAudienceAge,
        storeVisitType,
        title,
        companyId,
      },
    });

    return response.json({
      message: "Solicitação de notificação enviada com sucesso.",
    });
  }

  async delete(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { id } = request.params;

    await prisma.notificationSolicitation.deleteMany({
      where: { id, companyId, status: "CREATED" },
    });

    return response.status(204).json();
  }

  async audienceCount(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = AudienceCountRequest.safeParse(request.body);

    if (!form.success) {
      throw new InternalError("Existem erros nos dados enviados.", 422);
    }

    const city = await prisma.city.findFirst({
      where: { companyAddresses: { some: { company: { id: companyId } } } },
    });

    const useCase = new GetAudienceUseCase(companyId, city.id);

    const count = await useCase.countAudience(form.data);

    return response.json({ count });
  }

  async monthlyRemaining(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const useCase =
      new ValidateNumberOfMonthlyNotificationSolicitationsUseCase();

    const {
      numberMaxOfMonthlyNotificationSolicitations,
      numberOfNotificationSolicitationThisMonth,
    } = await useCase.getCount(companyId);

    return response.json({
      monthlyRemaining:
        numberMaxOfMonthlyNotificationSolicitations -
        numberOfNotificationSolicitationThisMonth,
    });
  }
}
