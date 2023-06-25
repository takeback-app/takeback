import dotenv from "dotenv";

dotenv.config();

import { prisma } from "../prisma";
import { Presets, SingleBar } from "cli-progress";
import { DateTime } from "luxon";

async function getLastCreatedAt(consumerId: string) {
  const transactions = await prisma.transaction.aggregate({
    where: { consumersId: consumerId },
    _max: { createdAt: true },
  });

  const bonus = await prisma.bonus.aggregate({
    where: { consumerId },
    _max: { createdAt: true },
  });

  if (!transactions._max.createdAt) return bonus._max.createdAt;

  if (!bonus._max.createdAt) return transactions._max.createdAt;

  return transactions._max.createdAt > bonus._max.createdAt
    ? transactions._max.createdAt
    : bonus._max.createdAt;
}

async function main() {
  await prisma.consumer.updateMany({
    data: { expireBalanceDate: null },
  });

  const consumers = await prisma.consumer.findMany();

  const bar = new SingleBar({}, Presets.shades_classic);

  bar.start(consumers.length, 0);

  for (const consumer of consumers) {
    const lastCreatedAt = await getLastCreatedAt(consumer.id);

    await prisma.consumer.update({
      where: { id: consumer.id },
      data: {
        expireBalanceDate: lastCreatedAt
          ? DateTime.fromJSDate(lastCreatedAt).plus({ months: 4 }).toJSDate()
          : null,
      },
    });

    bar.increment();
  }

  bar.stop();
}

main();
