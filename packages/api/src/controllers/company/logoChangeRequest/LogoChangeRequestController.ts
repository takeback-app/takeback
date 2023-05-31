import { Request, Response } from "express";

import { prisma } from "../../../prisma";

export class LogoChangeRequestController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const logoChangeRequests = await prisma.logoChangeRequest.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    return response.status(200).json(logoChangeRequests);
  }

  async store(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { logoUrl } = request.body;

    const logoChangeRequest = await prisma.logoChangeRequest.create({
      data: { logoUrl, companyId },
    });

    return response.status(201).json(logoChangeRequest);
  }

  async delete(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { id } = request.params;

    await prisma.logoChangeRequest.deleteMany({
      where: { id, companyId },
    });

    return response.status(204).json();
  }
}
