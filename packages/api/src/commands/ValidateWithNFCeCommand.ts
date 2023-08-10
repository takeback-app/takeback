import 'dotenv/config'

import { Presets, SingleBar } from 'cli-progress'
import { DateTime } from 'luxon'
import { NFCeValidationStatus } from '@prisma/client'
import { prisma } from '../prisma'
import { TransactionStatusEnum } from '../enum/TransactionStatusEnum'
import { AutomaticCancelTransactionsUseCase } from '../useCases/integration/AutomaticCancelTransactionsUseCase'

async function main() {
  await new AutomaticCancelTransactionsUseCase().handle()

  const dateLimit = DateTime.now().minus({ minutes: 30 }).toJSDate()

  await prisma.transaction.updateMany({
    where: {
      transactionStatus: { description: TransactionStatusEnum.PENDING },
      nfceValidationStatus: NFCeValidationStatus.IN_PROGRESS,
      createdAt: { lt: dateLimit },
    },
    data: { nfceValidationStatus: NFCeValidationStatus.NOT_FOUND },
  })

  await prisma.nFCe.deleteMany({
    where: { transaction: null, createdAt: { lt: dateLimit } },
  })

  const transactions = await prisma.transaction.findMany({
    where: {
      transactionStatus: { description: TransactionStatusEnum.PENDING },
      nfceValidationStatus: NFCeValidationStatus.IN_PROGRESS,
      company: { integrationSettings: { isNot: null } },
    },
    include: {
      transactionPaymentMethods: {
        select: {
          amount: true,
          // companyPaymentMethod: {
          //     select: { paymentMethod: { select: { tPag: true } } },
          //   },
        },
      },
    },
  })

  const nfceHashMap = (
    await prisma.nFCe.findMany({
      where: {
        transaction: null,
        issuedAt: { gte: dateLimit },
      },
      select: {
        id: true,
        companyId: true,
        nfcePayments: { select: { tPag: true, value: true } },
      },
    })
  ).reduce((hashMap, nfce) => {
    const paymentKey = nfce.nfcePayments
      .map((np) => `${np.value}`)
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
      .map((tpm) => `${tpm.amount}`)
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
      data: { nfceId, nfceValidationStatus: NFCeValidationStatus.VALIDATED },
    })
  }

  bar.stop()
}

main()
