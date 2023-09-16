import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class IntegrationController {
  async getIntegrationType(request: Request, response: Response) {
    const { companyId } = request.params

    const company = await prisma.company.findFirst({
      where: { id: companyId },
      select: {
        useQRCode: true,
        integrationSettings: { select: { id: true } },
      },
    })

    let integrationType = 'NONE'

    if (company.integrationSettings) {
      integrationType = 'DESKTOP'
    }

    if (company.useQRCode) {
      integrationType = 'QRCODE'
    }

    return response.json({ integrationType })
  }
}
