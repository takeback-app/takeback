import 'dotenv/config'

import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'

async function main() {
  const paymentMethods = await prisma.paymentMethod.findMany({
    where: { initialPercentage: { not: null } },
  })

  const companies = await prisma.company.findMany({
    where: { firstAccessAllowedAt: { not: null } },
    include: { companyPaymentMethods: true },
  })

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(companies.length, 0)

  for (const company of companies) {
    for (const paymentMethod of paymentMethods) {
      const alreadyCreated = !!company.companyPaymentMethods.find(
        (p) => p.paymentMethodId === paymentMethod.id,
      )

      if (alreadyCreated) continue

      await prisma.companyPaymentMethod.create({
        data: {
          companyId: company.id,
          paymentMethodId: paymentMethod.id,
          cashbackPercentage: paymentMethod.initialPercentage,
          isActive: true,
        },
      })
    }

    bar.increment()
  }

  bar.stop()
}

main()
