import { Request, Response } from "express";
import { prisma } from "../../../prisma";

const PER_PAGE = 25;

export class BonusController {
  async index(request: Request, response: Response) {
    const pageQuery = request.query.page;

    const page = Number(pageQuery) || 1;

    const bonuses = await prisma.bonus.findMany({
      include: { consumer: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    const count = await prisma.bonus.count();

    return response.json({
      data: bonuses,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const bonus = await prisma.bonus.findUnique({
      where: { id },
      include: {
        consumer: { select: { fullName: true, cpf: true } },
        transaction: {
          select: {
            company: { select: { id: true, fantasyName: true } },
            companyUser: { select: { name: true, cpf: true } },
            consumer: { select: { fullName: true } },
          },
        },
      },
    });

    return response.json(bonus);
  }
}
