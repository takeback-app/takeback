import { Request, Response } from 'express'
import { IntegrationType } from '@prisma/client'
import { prisma } from '../../prisma'

export class IntegrationController {
  async getIntegrationType(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const company = await prisma.company.findFirst({
      where: { id: companyId },
      select: {
        useQRCode: true,
        integrationType: true,
        useCMM: true,
        integrationSettings: { select: { id: true } },
      },
    })

    let integrationType = 'NONE'

    if (
      company.integrationSettings &&
      company.integrationType === IntegrationType.DESKTOP
    ) {
      integrationType = 'DESKTOP'
    }

    if (company.integrationType === IntegrationType.CMM) {
      integrationType = 'CMM'
    }

    return response.json({
      integrationType,
      useQRCode: company.useQRCode,
    })
  }
}
