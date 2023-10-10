import 'dotenv/config'
import { GeneratePixFromConsumerUseCase } from '../useCases/consumer/GeneratePixFromConsumerUseCase'

// import { Presets, SingleBar } from 'cli-progress'
// import { prisma } from '../prisma'

async function main() {
  // const allConsumers = await prisma.consumer.findMany({})

  // const bar = new SingleBar({}, Presets.shades_classic)

  // bar.start(allConsumers.length, 0)

  // for (const consumer of allConsumers) {
  //   await prisma.consumer.update({
  //     where: { id: consumer.id },
  //     data: { activatedAt: consumer.createdAt },
  //   })

  //   bar.increment()
  // }

  // bar.stop()

  const consumerId = '1faa2ca7-e873-4dac-893f-ac89d00274ff'
  const value = 10

  const pix = await GeneratePixFromConsumerUseCase.create(consumerId, value)

  console.log(pix)
}

main()
