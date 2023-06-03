import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { currency } from "../../utils/Masks";

export class DataController {
  async cities(_request: Request, response: Response) {
    const cities = await prisma.city.findMany();

    return response.json(
      cities.map((city) => ({ text: city.name, value: city.id }))
    );
  }

  async industries(_request: Request, response: Response) {
    const industries = await prisma.industry.findMany();

    return response.json(
      industries.map((industry) => ({
        text: industry.description,
        value: industry.id,
      }))
    );
  }

  async consultants(request: Request, response: Response) {
    const { representativeId } = request["tokenPayload"];

    const users = await prisma.representativeUser.findMany({
      where: { representativeId, role: "CONSULTANT" },
    });

    return response.json(
      users.map((user) => ({
        text: user.name,
        value: user.id,
      }))
    );
  }

  async paymentPlans(_request: Request, response: Response) {
    const paymentPlans = await prisma.paymentPlan.findMany();

    return response.json(
      paymentPlans.map((paymentPlan) => ({
        text: `${paymentPlan.description} - ${currency(+paymentPlan.value)}`,
        value: paymentPlan.id,
      }))
    );
  }
}
