import { Request, Response } from 'express'
import { prisma } from '../../../prisma'

export class CityCompaniesController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
      include: {
        companyAddress: {
          select: {
            cityId: true,
          },
        },
      },
    })

    const companies = await prisma.company.findMany({
      where: {
        companyAddress: {
          cityId: company.companyAddress.cityId,
        },
      },
      select: {
        id: true,
        fantasyName: true,
      },
    })

    return response.status(200).json(companies)
  }
}
