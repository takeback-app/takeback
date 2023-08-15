import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { ClientsReport } from './../../../reports/manager/ClientsReport'
import { CompanyClientReportRequest } from '../../../requests/reports/CompanyClientReportRequest'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { filterNumber } from '../../../utils'

export class ClientReportController {
  async index(request: Request, response: Response) {
    const form = CompanyClientReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const { dateEnd, dateStart, cityId, stateId, order, orderByColumn, page } =
      form.data

    const report = new ClientsReport()

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        cityId: filterNumber(cityId),
        order,
        orderByColumn,
        stateId: filterNumber(stateId),
      },
    )

    return response.status(200).json(paginated)
  }

  async getExcel(request: Request, response: Response) {
    const form = CompanyClientReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const { dateEnd, dateStart, cityId, stateId, order, orderByColumn } =
      form.data

    const report = new ClientsReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
    })

    excel.write('Relatório de Cliente.xlsx', response)
  }

  async getPdf(request: Request, response: Response) {
    const form = CompanyClientReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const { dateEnd, dateStart, cityId, stateId, order, orderByColumn } =
      form.data

    const report = new ClientsReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
    })

    response.setHeader('Content-type', 'application/pdf')
    response.setHeader(
      'Content-disposition',
      'inline; filename="Relatório de Cliente.pdf"',
    )

    pdf.pipe(response)
    pdf.end()
  }

  async totalizer(request: Request, response: Response) {
    const { dateEnd, dateStart } = request.query as Record<string, string>

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).startOf('day').toJSDate()
      : undefined

    const consumerCount = await prisma.consumer.count({
      where: {
        transactions: {
          some: {
            createdAt: { gte: startDate, lte: endDate },
          },
        },
      },
    })

    const totalShoppingValue = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: {
        totalAmount: true,
      },
    })

    const totalApprovedCashback = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        transactionStatus: {
          description: {
            in: [TransactionStatusEnum.APPROVED],
          },
        },
      },
      _sum: {
        cashbackAmount: true,
      },
    })

    const totalBalance = await prisma.consumer.aggregate({
      _sum: {
        blockedBalance: true,
        balance: true,
      },
    })

    return response.status(200).json({
      consumerCount,
      totalShoppingValue: totalShoppingValue._sum.totalAmount,
      totalApprovedCashback: totalApprovedCashback._sum.cashbackAmount,
      pendingAmount: totalBalance._sum.blockedBalance,
      balanceAmount: totalBalance._sum.balance,
    })
  }
}
