import { Request, Response } from 'express'
import { prisma } from '../../prisma'

export class CompanyUserTypeController {
  async index(_request: Request, response: Response) {
    const data = await prisma.companyUserType.findMany({
      select: {
        id: true,
        description: true,
        isManager: true,
      },
    })

    return response.json(data)
  }
}
