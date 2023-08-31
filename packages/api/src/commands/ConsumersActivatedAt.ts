import 'dotenv/config'

import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'

async function main() {
  const allConsumers = await prisma.consumer.findMany({})

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(allConsumers.length, 0)

  for (const consumer of allConsumers) {
    await prisma.consumer.update({
      where: { id: consumer.id },
      data: { activatedAt: consumer.createdAt },
    })

    bar.increment()
  }

  bar.stop()
}

main()
