import { InternalError } from '../../../config/GenerateErros'
import { CompanyStatusEnum } from '../../../enum/CompanyStatusEnum'
import { prisma } from '../../../prisma'

export class ListCompaniesUseCase {
  async execute(companyId: string) {
    const companies = await prisma.company.findMany({
      where: {
        id: { not: companyId },
        companyStatus: { description: CompanyStatusEnum.ACTIVE },
      },
      select: {
        id: true,
        fantasyName: true,
      },
      orderBy: {
        fantasyName: 'asc',
      },
    })

    if (!companies) {
      throw new InternalError('Erro ao tentar buscar as empresas', 400)
    }

    return companies
  }
}
