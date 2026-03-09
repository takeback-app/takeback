import 'dotenv/config'
import { DateTime } from 'luxon'
import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'
import { ApproveSolicitationUseCase } from '../useCases/cashback/ApproveSolicitationUseCase'

// Constantes
const STATUS_WAITING = 'WAITING'

async function main() {
  const refDate = DateTime.now().minus({ days: 2 }).toJSDate()

  try {
    const solicitations = await prisma.transactionSolicitation.findMany({
      where: {
        status: STATUS_WAITING,
        createdAt: { lte: refDate },
      },
    })
    console.log('')
    const bar = new SingleBar({}, Presets.shades_classic)
    bar.start(solicitations.length, 0)

    const approveUseCase = new ApproveSolicitationUseCase()

    for (const solicitation of solicitations) {
      await approveUseCase.execute(solicitation)
      bar.increment()
    }

    bar.stop()
  } catch (error) {
    console.error('Ocorreu um erro:', error)
  }
}

main()
