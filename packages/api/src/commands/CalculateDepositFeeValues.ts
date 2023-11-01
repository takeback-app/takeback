import 'dotenv/config'
import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'

async function main() {
  try {
    const deposits = await prisma.deposit.findMany()

    const bar = new SingleBar({}, Presets.shades_classic)
    bar.start(deposits.length, 0)

    for (const deposit of deposits) {
      await prisma.deposit.update({
        where: {
          id: deposit.id,
        },
        data: {
          depositFeeValue: deposit.value.times(deposit.depositFeePercentage),
          bankPixFeeValue: deposit.value.times(deposit.bankPixFeePercentage),
        },
      })
      bar.increment()
    }

    bar.stop()
  } catch (error) {
    console.error('Ocorreu um erro:', error)
  }
}

main()
