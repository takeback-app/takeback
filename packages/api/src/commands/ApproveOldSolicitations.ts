import 'dotenv/config'
import { DateTime } from 'luxon'
import { Presets, SingleBar } from 'cli-progress'
import { prisma } from '../prisma'
import { ApproveSolicitationUseCase } from '../useCases/cashback/ApproveSolicitationUseCase'

// Constantes
const STATUS_WAITING = 'WAITING'

async function getCompanyUser(companyUserId?: string) {
  if (!companyUserId) {
    return null
  }
  try {
    const result = await prisma.companyUser.findUnique({
      where: { id: companyUserId },
    })
    return result
  } catch (error) {
    console.error(`Erro ao buscar companyUser: ${error.message}`)
    return null
  }
}

async function getCompany(companyId: string) {
  try {
    const result = await prisma.company.findUnique({
      where: { id: companyId },
    })
    return result
  } catch (error) {
    console.error(`Erro ao buscar company: ${error.message}`)
    return null
  }
}

async function main() {
  const refDate = DateTime.now().minus({ day: 1 }).toJSDate()

  try {
    const solicitations = await prisma.transactionSolicitation.findMany({
      where: {
        status: STATUS_WAITING,
        createdAt: { lte: refDate },
      },
      include: {
        consumer: {
          select: {
            cpf: true,
          },
        },
      },
    })

    const bar = new SingleBar({}, Presets.shades_classic)
    bar.start(solicitations.length, 0)

    const approveUseCase = new ApproveSolicitationUseCase()

    for (const solicitation of solicitations) {
      const companyUser = await getCompanyUser(solicitation.companyUserId)
      const company = await getCompany(solicitation.companyId)

      if (!company) {
        continue
      }

      if (companyUser) {
        if (
          companyUser.cpf === solicitation.consumer.cpf ||
          companyUser.companyId === company.id
        ) {
          continue
        }
      }

      await approveUseCase.execute(solicitation, companyUser?.id)
      bar.increment()
    }

    bar.stop()
  } catch (error) {
    console.error('Ocorreu um erro:', error)
  }
}

main()
