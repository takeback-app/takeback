import 'dotenv/config'

import { SingleBar, Presets } from 'cli-progress'

import { maskCPF } from '../utils/Masks'

import { redis } from '../redis'

import { prisma } from '../prisma'

const TAG = 'autocomplete'

async function main() {
  const transactions = await prisma.transaction.findMany({
    distinct: ['consumersId'],
    select: {
      consumer: {
        select: {
          cpf: true,
          fullName: true,
        },
      },
      companiesId: true,
    },
  })

  const bar = new SingleBar({}, Presets.shades_classic)

  bar.start(transactions.length, 0)

  // const keys = await redis.keys(`${TAG}*`);

  // await redis.del(keys);

  for (const { consumer, companiesId } of transactions) {
    const cpf = consumer.cpf.replace(/\D/g, '')

    await redis.set(
      `${TAG}:${companiesId}:${cpf}`,
      `${maskCPF(cpf)} - ${consumer.fullName}`,
    )

    bar.increment()
  }

  bar.stop()
}

main()
