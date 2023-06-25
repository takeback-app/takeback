import { Request, Response } from "express";
import { prisma } from "../../../prisma";

const PER_PAGE = 25;

export class NotificationController {
  async index(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { page } = request.query;

    const pageNumber = Number(page) || 1;

    const notifications = await prisma.notification.findMany({
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        readAt: true,
        createdAt: true,
      },
      where: {
        takeBackUserId: id,
      },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (pageNumber - 1) * PER_PAGE,
    });

    const count = await prisma.notification.count();

    return response.json({
      data: notifications,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
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

  async unread(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const notifications = await prisma.notification.findMany({
      where: {
        readAt: null,
        takeBackUserId: id,
      },
      orderBy: { createdAt: "desc" },
    });

    return response.json({
      data: notifications,
    });
  }
}
