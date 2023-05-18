import { z } from "zod";
import { ItemSchema } from "../../requests/CreateRaffleRequest";
import { prisma } from "../../prisma";

type ItemData = z.infer<typeof ItemSchema>;

export class UpdateOrCreateRaffleItemsUseCase {
  async execute(raffleId: string, items: ItemData[]) {
    await prisma.raffleItem.deleteMany({
      where: { raffleId },
    });

    await prisma.raffleItem.createMany({
      data: items.map(({ description, order, imageUrl }) => ({
        description,
        order,
        imageUrl,
        raffleId,
      })),
    });
  }
}
