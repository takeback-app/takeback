import { Request, Response } from "express";
import { prisma } from "../../prisma";

export class CompanyPaymentMethodController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const data = await prisma.paymentMethod.findMany({
      select: { id: true, description: true },
      where: { companyPaymentMethods: { some: { companyId } } },
    });

    return response.json(data);
  }
}
