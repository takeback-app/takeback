import { Request, Response } from "express";
import { prisma } from "../../prisma";

export class ReferralBonusController {
  async index(_request: Request, response: Response) {
    const { referralBonusPercentage } = await prisma.setting.findFirst();

    return response.json({
      percentage: (+referralBonusPercentage * 100).toFixed(0),
    });
  }

  async update(request: Request, response: Response) {
    const { percentage } = request.body;

    const settings = await prisma.setting.findFirst();

    await prisma.setting.update({
      where: { id: settings.id },
      data: { referralBonusPercentage: +percentage / 100 },
    });

    return response.json({ message: "Porcentagem atualizada com sucesso" });
  }
}
