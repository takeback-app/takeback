import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class IntegrationController {
  async getIntegrationType(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const integration = await prisma.integrationSettings.findFirst({
      where: { companyId },
    })

    return response.json({ integrationType: integration?.type || 'NONE' })
  }
}
