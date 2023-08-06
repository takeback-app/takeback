import 'dotenv/config'

import { DateTime, Settings } from 'luxon'
import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'
import { Notify } from '../notifications'
import { LastDayToWithdrawalProduct } from '../notifications/LastDayToWithdrawalProduct'

Settings.defaultZone = 'America/Sao_Paulo'

async function main() {
  const refDate = DateTime.now().endOf('day').plus({ days: 1 }).toJSDate()

  const orders = await prisma.storeOrder.findMany({
    where: {
      product: { dateLimitWithdrawal: { lte: refDate } },
      withdrawalAt: null,
    },
    include: {
      product: { select: { company: { select: { fantasyName: true } } } },
    },
  })

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(orders.length, 0)

  for (const order of orders) {
    await Notify.send(
      order.consumerId,
      new LastDayToWithdrawalProduct(order, order.product.company.fantasyName),
    )

    bar.increment()
  }

  bar.stop()
}

main()
