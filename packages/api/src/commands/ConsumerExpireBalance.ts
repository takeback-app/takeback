import 'dotenv/config'

import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'

async function main() {
  const expiredConsumers = await prisma.consumer.findMany({
    select: { id: true, balance: true },
    where: { expireBalanceDate: { lte: new Date() }, balance: { gt: 0 } },
  })

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(expiredConsumers.length, 0)

  for (const consumer of expiredConsumers) {
    await prisma.consumer.update({
      where: { id: consumer.id },
      data: { balance: 0 },
    })

    await prisma.consumerExpireBalances.create({
      data: { consumerId: consumer.id, balance: consumer.balance },
    })

    bar.increment()
  }

  bar.stop()
}

main()
