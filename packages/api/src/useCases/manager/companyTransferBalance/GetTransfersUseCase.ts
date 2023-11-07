import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

const PER_PAGE = 25

export class GetTransfersUseCase {
  async execute(page: number) {
    const transfers = await prisma.companyTransfer.findMany({
      select: {
        id: true,
        value: true,
        createdAt: true,
        senderCompany: {
          select: {
            fantasyName: true,
          },
        },
        receiverCompany: {
          select: {
            fantasyName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    })

    if (!transfers) {
      throw new InternalError('Erro ao tentar buscar as transferências', 400)
    }

    const count = await prisma.companyTransfer.count()

    return {
      data: transfers,
      meta: { lastPage: Math.ceil(count / PER_PAGE) },
    }
  }
}
