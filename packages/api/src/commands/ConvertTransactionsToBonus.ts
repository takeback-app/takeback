import dotenv from "dotenv";
import { Presets, SingleBar } from "cli-progress";

dotenv.config();

import { prisma } from "../prisma";

async function main() {
  const transactions = await prisma.transaction.findMany({
    where: { transactionStatusId: 10 },
  });

  const bar = new SingleBar({}, Presets.shades_classic);

  bar.start(transactions.length, 0);

  for (const transaction of transactions) {
    await prisma.bonus.create({
      data: {
        type: "SELL",
        value: +transaction.cashbackAmount,
        createdAt: transaction.createdAt,
        consumerId: transaction.consumersId,
        transactionId: transaction.fatherTransactionId,
      },
    });

    bar.increment();
  }

  bar.stop();
}

main();
