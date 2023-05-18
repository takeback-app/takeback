import dotenv from "dotenv";

dotenv.config();

import { prisma } from "../prisma";
import { DateTime } from "luxon";

async function main() {
  const date = DateTime.now().plus({ months: 6 });

  await prisma.consumer.updateMany({
    where: { expireBalanceDate: null },
    data: { expireBalanceDate: date.toJSDate() },
  });
}

main();
