import { Request, Response } from "express";
import { prisma } from "../../../prisma";

export class NotificationController {
  async index(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { page } = request.query;

    const pageNumber = Number(page) || 1;

    const perPage = 25;

    const notifications = await prisma.notification.findMany({
      where: {
        takeBackUserId: id,
      },
      orderBy: { createdAt: "desc" },
      take: perPage,
      skip: (pageNumber - 1) * perPage,
    });

    const count = await prisma.notification.count({
      where: {
        takeBackUserId: id,
      },
    });

    return response.json({
      data: notifications,
      meta: { lastPage: Math.ceil(count / perPage) },
    });
  }

  async update(request: Request, response: Response) {
    const { isRead } = request.body;

    const { id } = request.params;

    await prisma.notification.update({
      where: { id },
      data: { readAt: isRead ? new Date() : null },
    });

    return response.json({ message: "Notificação atualizada" });
  }

  async updateMany(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { isRead } = request.body;

    await prisma.notification.updateMany({
      where: {
        takeBackUserId: id,
        readAt: isRead ? null : undefined,
      },
      data: { readAt: isRead ? new Date() : null },
    });

    return response.json({ message: "Notificação atualizada" });
  }

  async unread(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const notifications = await prisma.notification.findMany({
      where: {
        takeBackUserId: id,
        readAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    return response.json(notifications);
  }
}
