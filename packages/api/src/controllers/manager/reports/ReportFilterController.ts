import { Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'

export class ReportFilterController {
  async states(request: Request, response: Response) {
    const { haveTransactions } = request.query as Record<string, string>

    let transactionFilter: Prisma.TransactionListRelationFilter
    if (haveTransactions) {
      transactionFilter =
        haveTransactions === 'true'
          ? {
              some: {},
            }
          : {
              none: {},
            }
    }

    const companyStates = await prisma.state.findMany({
      where: {
        city: {
          some: {
            companyAddresses: {
              some: {
                id: { not: undefined },
                company: {
                  transactions: transactionFilter,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        initials: true,
      },
    })

    const consumerStates = await prisma.state.findMany({
      where: {
        city: {
          some: {
            consumerAddresses: {
              some: {
                id: { not: undefined },
                consumer: {
                  transactions: transactionFilter,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        initials: true,
      },
    })

    return response.json({ companyStates, consumerStates })
  }

  async cities(request: Request, response: Response) {
    const { stateId } = request.query as Record<string, string>

    const companyCities = await prisma.city.findMany({
      where: {
        companyAddresses: { some: { id: { not: undefined } } },
        stateId: filterNumber(stateId),
      },
      select: {
        id: true,
        name: true,
      },
    })

    const consumerCities = await prisma.city.findMany({
      where: {
        consumerAddresses: { some: { id: { not: undefined } } },
        stateId: filterNumber(stateId),
      },
      select: {
        id: true,
        name: true,
      },
    })

    return response.json({ companyCities, consumerCities })
  }

  async companyStatus(request: Request, response: Response) {
    const status = await prisma.companyStatus.findMany({
      select: {
        id: true,
        description: true,
      },
    })

    return response.json(status)
  }

  async companies(request: Request, response: Response) {
    const { cityId, stateId, statusId } = request.query as Record<
      string,
      string
    >

    const companies = await prisma.company.findMany({
      where: {
        companyAddress: {
          AND: [
            { cityId: filterNumber(cityId) },
            { city: { stateId: filterNumber(stateId) } },
          ],
        },
        statusId: filterNumber(statusId),
      },
      select: {
        id: true,
        fantasyName: true,
      },
    })

    return response.json(companies)
  }

  async companyUsers(request: Request, response: Response) {
    const { companyId } = request.query as Record<string, string>

    if (!companyId) return response.json([])

    const users = await prisma.companyUser.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
      },
    })

    return response.json(users)
  }

  async transactionStatus(request: Request, response: Response) {
    const status = await prisma.transactionStatus.findMany({
      select: {
        id: true,
        description: true,
      },
    })

    return response.json(status)
  }

  async paymentMethods(request: Request, response: Response) {
    const paymentMethods = await prisma.paymentMethod.findMany({
      select: {
        id: true,
        description: true,
      },
    })

    return response.json(paymentMethods)
  }
}
