import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

export class GetCompanyBalanceUseCase {
  async execute(companyId: string) {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      select: {
        positiveBalance: true,
      },
    })

    if (!company) {
      throw new InternalError('Erro ao buscar saldo da empresa', 400)
    }

    return company
  }
}
