import 'dotenv/config'

import { DateTime } from 'luxon'
import { prisma } from '../prisma'

async function main() {
  const refDate = DateTime.now().minus({ day: 1 }).toJSDate()

  await prisma.transactionSolicitation.updateMany({
    where: { status: 'WAITING', createdAt: { lte: refDate } },
    data: { status: 'CANCELED' },
  })
}

main()
