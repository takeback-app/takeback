import { DateTime } from 'luxon'
import { CompanyStatusEnum } from '../../../enum/CompanyStatusEnum'
import { prisma } from '../../../prisma'

class VerifyProvisionalAccessUseCase {
  async execute() {
    const settings = await prisma.setting.findUnique({ where: { id: 1 } })
    const companiesBloqued = []

    const provisonalAccess = await prisma.companyStatus.findFirst({
      where: { description: CompanyStatusEnum.PROVISIONAL_RELEASE },
    })

    const companiesInProvisionalAccess = await prisma.company.findMany({
      where: { statusId: provisonalAccess.id },
      include: { companyStatus: true },
    })

    const today = DateTime.now()
    const blockedStatus = await prisma.companyStatus.findFirst({
      where: { description: CompanyStatusEnum.BLOCKED },
    })

    for await (const item of companiesInProvisionalAccess) {
      const expirateDate = DateTime.fromJSDate(item.provisionalAccessAllowedAt)
        .endOf('day')
        .plus({ days: settings.provisionalAccessDays })

      if (today > expirateDate) {
        await prisma.company.update({
          where: { id: item.id },
          data: { statusId: blockedStatus.id },
        })
        companiesBloqued.push(item.id)
      }
    }

    return {
      message: `Verificação de acesso provisório completa! Foram bloqueadas ${companiesBloqued.length} empresas.`,
    }
  }
}

export { VerifyProvisionalAccessUseCase }
