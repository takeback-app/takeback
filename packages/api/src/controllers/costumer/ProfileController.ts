import { Request, Response } from "express";
import { prisma } from "../../prisma";

export class ProfileController {
  async deactivate(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    await prisma.consumer.update({
      where: { id: consumerId },
      data: { deactivatedAccount: true },
    });

    return response.json({ message: "ok" });
  }

  async notificationToken(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];
    const { token } = request.body;

    await prisma.consumer.update({
      where: { id: consumerId },
      data: { expoNotificationToken: token },
    });

    return response.status(204).json();
  }
}
