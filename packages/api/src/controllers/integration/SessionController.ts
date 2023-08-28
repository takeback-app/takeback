import { Request, Response } from 'express'
import { prisma } from '../../prisma'
import { InternalError } from '../../config/GenerateErros'

class SessionController {
  async me(request: Request, response: Response) {
    const companyId = request['companyId']

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        fantasyName: true,
        registeredNumber: true,
        integrationSettings: { select: { url: true, type: true } },
      },
    })

    if (!company.integrationSettings) {
      throw new InternalError('Integração não configurada', 403)
    }

    if (company.integrationSettings.type !== 'DESKTOP') {
      throw new InternalError(
        'Integração não configurada para esse tipo de aplicação',
        403,
      )
    }

    return response.status(200).json(company)
  }
}

export default new SessionController()
