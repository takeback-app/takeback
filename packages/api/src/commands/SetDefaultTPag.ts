import 'dotenv/config'

import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'

async function main() {
  const companyPaymentMethods = await prisma.companyPaymentMethod.findMany({
    where: { tPag: null, paymentMethod: { tPag: { not: null } } },
    select: {
      id: true,
      paymentMethod: { select: { tPag: true } },
    },
  })

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(companyPaymentMethods.length, 0)

  for (const { id, paymentMethod } of companyPaymentMethods) {
    await prisma.companyPaymentMethod.update({
      where: { id },
      data: { tPag: paymentMethod.tPag },
    })

    bar.increment()
  }

  bar.stop()
}

main()
