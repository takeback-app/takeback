import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class IntegrationController {
  async getIntegrationType(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const company = await prisma.company.findFirst({
      where: { id: companyId },
      select: { useQRCode: true },
    })

    return response.json({
      integrationType: company.useQRCode ? 'QRCODE' : 'DESKTOP',
    })
  }
}
