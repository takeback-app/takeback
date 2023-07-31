import 'dotenv/config'

import { SingleBar, Presets } from 'cli-progress'
import { Decimal } from '@prisma/client/runtime'
import { prisma } from '../prisma'
import { TransactionStatusEnum } from '../enum/TransactionStatusEnum'

async function main() {
  const consumers = await prisma.consumer.findMany({
    where: { blockedBalance: { not: 0 } },
  })

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(consumers.length, 0)

  for (const consumer of consumers) {
    const a = await prisma.transaction.aggregate({
      where: {
        consumersId: consumer.id,
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.ON_DELAY,
              TransactionStatusEnum.PROCESSING,
            ],
          },
        },
      },
      _sum: {
        cashbackAmount: true,
      },
    })

    const blockedBalance = a._sum.cashbackAmount || new Decimal(0)

    if (!blockedBalance.sub(consumer.blockedBalance).equals(0)) {
      await prisma.consumer.update({
        where: { id: consumer.id },
        data: { blockedBalance },
      })
    }

    bar.increment()
  }

  bar.stop()
}

main()
