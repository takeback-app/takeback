import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { CompanyStatusEnum } from '../../../enum/CompanyStatusEnum'
import { prisma } from '../../../prisma'

interface Props {
  companyId: string
}

class GenerateProvisionalAccessUseCase {
  async execute({ companyId }: Props) {
    if (!companyId) {
      throw new InternalError('Informe a empresa', 400)
    }

    const settings = await prisma.setting.findUnique({ where: { id: 1 } })

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { companyUsers: true },
    })

    if (company.companyUsers.length === 0) {
      throw new InternalError(
        'Não é permitido gerar liberação provisória para empresas que não possuem usuários',
        400,
      )
    }

    const status = await prisma.companyStatus.findFirst({
      where: { description: CompanyStatusEnum.PROVISIONAL_RELEASE },
    })

    await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        statusId: status.id,
        provisionalAccessAllowedAt: DateTime.now().toJSDate(),
      },
    })

    const expireDate = DateTime.now()
      .plus({ days: settings.provisionalAccessDays })
      .toJSDate()
      .toLocaleDateString()

    return `Liberação provisória gerada - Data do vencimento: ${expireDate}`
  }
}

export { GenerateProvisionalAccessUseCase }
