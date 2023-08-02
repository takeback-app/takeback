import 'dotenv/config'

import { DateTime } from 'luxon'
import { prisma } from '../prisma'
import { Notify } from '../notifications'
import { LastDayToWithdrawalProduct } from '../notifications/LastDayToWithdrawalProduct'

async function main() {
  const refDate = DateTime.now().plus({ day: 1 }).toJSDate()

  const orders = await prisma.storeOrder.findMany({
    where: {
      product: { dateLimitWithdrawal: { lte: refDate } },
      withdrawalAt: null,
    },
    include: {
      consumer: true,
      product: { select: { company: { select: { fantasyName: true } } } },
    },
  })

  for (const order of orders) {
    Notify.send(
      order.consumer.id,
      new LastDayToWithdrawalProduct(order, order.product.company.fantasyName),
    )
  }
}

main()
