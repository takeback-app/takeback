import { DateTime } from "luxon";

import { prisma } from "../../prisma";

export class UpdateBalanceExpireDate {
  async execute(consumerId: string) {
    const expireDate = DateTime.now().plus({ months: 4 });

    await prisma.consumer.update({
      where: { id: consumerId },
      data: { expireBalanceDate: expireDate.toJSDate() },
    });
  }
}
