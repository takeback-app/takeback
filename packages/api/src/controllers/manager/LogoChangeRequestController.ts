import { Request, Response } from "express";

import { prisma } from "../../prisma";

export class LogoChangeRequestController {
  async index(_request: Request, response: Response) {
    const logoChangeRequests = await prisma.logoChangeRequest.findMany({
      where: { status: "CREATED" },
      orderBy: { createdAt: "desc" },
      include: { company: { select: { fantasyName: true } } },
    });

    return response.status(200).json(logoChangeRequests);
  }

  async reprove(request: Request, response: Response) {
    const { id } = request.params;

    await prisma.logoChangeRequest.update({
      where: { id },
      data: { status: "REPROVED" },
    });

    return response.status(204).json();
  }

  async approve(request: Request, response: Response) {
    const { id } = request.params;

    const logoChangeRequest = await prisma.logoChangeRequest.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    await prisma.company.update({
      where: { id: logoChangeRequest.companyId },
      data: { logoUrl: logoChangeRequest.logoUrl },
    });

    return response.status(200).json({ message: "Logo alterado com sucesso!" });
  }
}
