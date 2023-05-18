import { Company as PrismaCompany, RaffleTicketStatus } from "@prisma/client";

import { prisma } from "../../prisma";
import { RaffleTicketCalculator } from "./RaffleTicketCalculator";
import { DateTime } from "luxon";
import { RaffleStatusEnum } from "../../enum/RaffleStatusEnum";

interface Props {
  companyId: string;
  consumerId: string;
  purchaseAmount: number;
  transactionId: number;
  status: RaffleTicketStatus;
}

type Company = PrismaCompany & {
  companyAddress: {
    cityId: number;
  };
};

export class GenerateTicketsUseCase {
  async execute({
    companyId,
    consumerId,
    purchaseAmount,
    transactionId,
    status,
  }: Props) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        companyAddress: { select: { cityId: true } },
      },
    });

    const raffles = await this.getRaffles(company, purchaseAmount);

    const ticketsCalculator = RaffleTicketCalculator.make({
      consumerId,
      purchaseAmount,
      transactionId,
    });

    for (const raffle of raffles) {
      await prisma.raffleTicket.createMany({
        data: await ticketsCalculator.generateTicketsData(raffle, status),
      });
    }

    return raffles;
  }

  private getRaffles(company: Company, purchaseAmount: number) {
    return prisma.raffle.findMany({
      include: {
        tickets: {
          take: 1,
          select: { number: true },
          orderBy: { number: "desc" },
        },
      },
      where: {
        status: { description: RaffleStatusEnum.APPROVED },
        ticketValue: { lte: purchaseAmount },
        drawDate: { gte: DateTime.now().startOf("day").toJSDate() },
        OR: [
          { companyId: company.id },
          {
            company: {
              companyAddress: { cityId: company.companyAddress.cityId },
            },
            isOpenToOtherCompanies: true,
          },
        ],
      },
    });
  }
}
