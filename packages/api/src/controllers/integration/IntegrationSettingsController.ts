import { Request, Response } from 'express'
import { prisma } from '../../prisma'

class IntegrationSettingsController {
  async update(request: Request, response: Response) {
    const companyId = request['companyId']

    const { url, folderPath } = request.body

    await prisma.integrationSettings.update({
      where: { companyId },
      data: { url, folderPath },
    })

    return response.status(200).json({ message: 'Configurações atualizadas' })
  }
}

export default new IntegrationSettingsController()
