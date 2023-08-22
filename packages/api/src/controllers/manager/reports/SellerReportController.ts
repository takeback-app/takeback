import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { SellersReport } from '../../../reports/manager/SellersReport'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'
import { ManagerSellerReportRequest } from '../../../requests/reports/manager/ManagerSellerReportRequest'

export class SellerReportController {
  async index(request: Request, response: Response) {
    const form = ManagerSellerReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      page,
      office,
      transactionStatus,
      cityId,
      companyId,
      stateId,
    } = form.data

    const report = new SellersReport()

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        order,
        orderByColumn,
        office: filterNumber(office),
        transactionStatus: filterNumber(transactionStatus),
        cityId: filterNumber(cityId),
        companyId,
        stateId: filterNumber(stateId),
      },
    )

    return response.status(200).json(paginated)
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerSellerReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office,
      transactionStatus,
    } = form.data

    const report = new SellersReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
    })

    excel.write('Relatório de Vendedor.xlsx', response)
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerSellerReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office,
      transactionStatus,
    } = form.data

    const report = new SellersReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
    })

    response.setHeader('Content-type', 'application/pdf')
    response.setHeader(
      'Content-disposition',
      'inline; filename="Relatório de Vendedor.pdf"',
    )

    pdf.pipe(response)
    pdf.end()
  }

  async totalizer(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const { dateEnd, dateStart, office, transactionStatus, cityId, stateId } =
      request.query as Record<string, string>

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).startOf('day').toJSDate()
      : undefined

    const companyAddress = {
      AND: [
        { cityId: filterNumber(cityId) },
        { city: { stateId: filterNumber(stateId) } },
      ],
    }

    const consumerCount = await prisma.companyUser.count({
      where: {
        companyUserTypesId: filterNumber(office),
        company: {
          id: companyId,
          companyAddress,
        },
        transactions: {
          some: {
            createdAt: { gte: startDate, lte: endDate },
            transactionStatusId: filterNumber(transactionStatus),
          },
        },
      },
    })

    const totalTransactions = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        companyUsersId: { not: null },
        companyUser: {
          companyUserTypesId: filterNumber(office),
        },
        companiesId: companyId,
        company: {
          companyAddress,
        },
        transactionStatusId: filterNumber(transactionStatus),
      },
      _sum: {
        totalAmount: true,
      },
    })

    const newClients = await prisma.bonus.count({
      where: {
        type: 'NEW_USER',
        transaction: {
          companyUsersId: companyId,
          company: {
            companyAddress,
          },
          createdAt: { gte: startDate, lte: endDate },
          transactionStatusId: filterNumber(transactionStatus),
          companyUser: {
            companyUserTypesId: filterNumber(office),
          },
        },
      },
    })

    return response.json({
      consumerCount,
      totalTransactions: totalTransactions._sum.totalAmount,
      newClients,
    })
  }
}
