import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { GetAudienceUseCase } from "../../useCases/notificationSolicitations/GetAudienceUseCase";
import { Notify } from "../../notifications";
import { CustomNotification } from "../../notifications/CustomNotification";

export class NotificationSolicitationController {
  async index(_request: Request, response: Response) {
    const notificationSolicitations =
      await prisma.notificationSolicitation.findMany({
        orderBy: { createdAt: "desc" },
      });

    return response.json(notificationSolicitations);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const notificationSolicitation =
      await prisma.notificationSolicitation.findUnique({
        where: { id },
      });

    const city = await prisma.city.findFirst({
      where: {
        companyAddresses: {
          some: { company: { id: notificationSolicitation.companyId } },
        },
      },
    });

    const useCase = new GetAudienceUseCase(
      notificationSolicitation.companyId,
      city.id
    );

    const count = await useCase.countAudience({
      ...notificationSolicitation,
      audienceBalance: notificationSolicitation.audienceBalance
        ? +notificationSolicitation.audienceBalance
        : undefined,
      dateOfPurchase: notificationSolicitation.dateOfPurchase?.toISOString(),
    });

    return response.json({ ...notificationSolicitation, audienceCount: count });
  }

  async approve(request: Request, response: Response) {
    const { id } = request.params;

    const notificationSolicitation =
      await prisma.notificationSolicitation.update({
        where: { id },
        data: { status: "APPROVED" },
      });

    const city = await prisma.city.findFirst({
      where: {
        companyAddresses: {
          some: { company: { id: notificationSolicitation.companyId } },
        },
      },
    });

    const useCase = new GetAudienceUseCase(
      notificationSolicitation.companyId,
      city.id
    );

    const consumers = await useCase.getAudience({
      ...notificationSolicitation,
      audienceBalance: notificationSolicitation.audienceBalance
        ? +notificationSolicitation.audienceBalance
        : undefined,
      dateOfPurchase: notificationSolicitation.dateOfPurchase?.toISOString(),
    });

    Notify.sendMany(
      consumers,
      new CustomNotification(
        id,
        notificationSolicitation.title,
        notificationSolicitation.message
      )
    );

    return response.status(204).json();
  }

  async reprove(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.notificationSolicitation.update({
      where: { id },
      data: { status: "REPROVED" },
    });

    return response.status(204).json();
  }
}
