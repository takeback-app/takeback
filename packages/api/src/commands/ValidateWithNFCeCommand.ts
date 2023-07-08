import 'dotenv/config'

import { Presets, SingleBar } from 'cli-progress'
import { DateTime } from 'luxon'
import { prisma } from '../prisma'
import { TransactionStatusEnum } from '../enum/TransactionStatusEnum'

async function main() {
  await prisma.transaction.updateMany({
    where: {
      transactionStatus: { description: TransactionStatusEnum.PENDING },
      validatedByNfce: null,
      createdAt: { lte: DateTime.now().minus({ day: 1 }).toJSDate() },
    },
    data: { validatedByNfce: false },
  })

  const transactions = await prisma.transaction.findMany({
    where: {
      transactionStatus: { description: TransactionStatusEnum.PENDING },
      validatedByNfce: null,
    },
    include: {
      transactionPaymentMethods: {
        include: {
          companyPaymentMethod: {
            select: { paymentMethod: { select: { tPag: true } } },
          },
        },
      },
    },
  })

  const nfceHashMap = (
    await prisma.nFCe.findMany({
      where: { transaction: null },
      select: {
        id: true,
        companyId: true,
        nfcePayments: { select: { tPag: true, value: true } },
      },
    })
  ).reduce((hashMap, nfce) => {
    const paymentKey = nfce.nfcePayments
      .map((np) => `${np.tPag}-${np.value}`)
      .sort()
      .join('/')

    const key = `${nfce.companyId}/${paymentKey}`

    hashMap.set(key, nfce.id)

    return hashMap
  }, new Map<string, string>())

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(transactions.length, 0)

  for (const transaction of transactions) {
    const transactionPaymentKey = transaction.transactionPaymentMethods
      .map(
        (tpm) => `${tpm.companyPaymentMethod.paymentMethod.tPag}-${tpm.amount}`,
      )
      .sort()
      .join('/')

    const transactionKey = `${transaction.companiesId}/${transactionPaymentKey}`

    const nfceId = nfceHashMap.get(transactionKey)

    bar.increment()

    if (!nfceId) {
      continue
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { nfceId, validatedByNfce: true },
    })
  }

  bar.stop()
}

main()
