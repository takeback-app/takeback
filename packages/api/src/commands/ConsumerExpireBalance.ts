import dotenv from "dotenv";

dotenv.config();

import { prisma } from "../prisma";
import { Presets, SingleBar } from "cli-progress";

async function main() {
  const expiredConsumers = await prisma.consumer.findMany({
    select: { id: true, balance: true },
    where: { expireBalanceDate: { lte: new Date() }, balance: { gt: 0 } },
  });

  const bar = new SingleBar({}, Presets.shades_classic);

  bar.start(expiredConsumers.length, 0);

  for (const consumer of expiredConsumers) {
    await prisma.consumer.update({
      where: { id: consumer.id },
      data: { balance: 0 },
    });

    await prisma.consumerExpireBalances.create({
      data: { consumerId: consumer.id, balance: consumer.balance },
    });

    bar.increment();
  }

  bar.stop();
}

main();
