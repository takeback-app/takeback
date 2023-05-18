import { Raffle } from "@prisma/client";
import { RaffleStatusEnum } from "../../enum/RaffleStatusEnum";
import { NewRaffle, Notify } from "../../notifications";
import { prisma } from "../../prisma";

export class NotifyNewRaffleUseCase {
  async execute(raffle: Raffle) {
    const status = await prisma.raffleStatus.findUniqueOrThrow({
      where: { id: raffle.statusId },
    });

    if (status.description !== RaffleStatusEnum.APPROVED) return;

    const address = await prisma.companyAddress.findFirst({
      where: { company: { id: raffle.companyId } },
      select: { cityId: true },
    });

    if (!address) return;

    const consumers = await prisma.consumer.findMany({
      where: {
        consumerAddress: { cityId: address.cityId },
      },
      select: { id: true, expoNotificationToken: true },
    });

    const company = await prisma.company.findUniqueOrThrow({
      where: { id: raffle.companyId },
      select: { fantasyName: true },
    });

    Notify.sendMany(consumers, new NewRaffle(raffle.id, company.fantasyName));
  }
}
