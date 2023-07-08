import { Request, Response } from 'express'
import { prisma } from '../../prisma'

class SessionController {
  async me(request: Request, response: Response) {
    const companyId = request['companyId']

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        fantasyName: true,
        registeredNumber: true,
        integrationSettings: { select: { url: true, folderPath: true } },
      },
    })

    return response.status(200).json(company)
  }
}

export default new SessionController()
