import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

interface TransferBalanceProps {
  companySentId: string
  companyReceivedId: string
  value: number
}

export class TransferBalanceUseCase {
  async execute({
    companySentId,
    companyReceivedId,
    value,
  }: TransferBalanceProps) {
    const companySent = await prisma.company.findUnique({
      where: {
        id: companySentId,
      },
      select: {
        id: true,
        positiveBalance: true,
      },
    })

    if (!companySent) {
      throw new InternalError('Empresa que vai enviar não encontrada', 400)
    }

    const companyRecived = await prisma.company.findUnique({
      where: {
        id: companyReceivedId,
      },
      select: {
        id: true,
        positiveBalance: true,
      },
    })

    if (!companyRecived) {
      throw new InternalError('Empresa que vai receber não encontrada', 400)
    }

    try {
      await prisma.$transaction(async (tx) => {
        const sentCompanyUpdate = await tx.company.update({
          where: { id: companySent.id },
          data: {
            positiveBalance: {
              decrement: value,
            },
          },
        })

        if (Number(sentCompanyUpdate.positiveBalance) < 0) {
          throw new InternalError('Saldo insuficiente', 400)
        }

        await tx.company.update({
          where: { id: companyRecived.id },
          data: {
            positiveBalance: {
              increment: value,
            },
          },
        })

        await tx.companyTransfer.create({
          data: {
            value,
            companySentId: companySent.id,
            companyReceivedId: companyRecived.id,
          },
        })

        return 'Sucesso'
      })
    } catch (err) {
      throw new InternalError('erro ao efetuar transferência', 400)
    }
  }
}
