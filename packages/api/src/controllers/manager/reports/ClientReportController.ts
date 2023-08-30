import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import {
  APPROVED_TRANSACTION_STATUS_ID,
  ClientsReport,
} from './../../../reports/manager/ClientsReport'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'
import { ManagerClientReportRequest } from '../../../requests/reports/manager/ManagerClientReportRequest'

export class ClientReportController {
  async index(request: Request, response: Response) {
    const form = ManagerClientReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      order,
      orderByColumn,
      haveTransactions,
      isPlaceholder,
      page,
    } = form.data

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
        haveTransactions: haveTransactions === 'true',
        isPlaceholder: isPlaceholder ? isPlaceholder === 'true' : undefined,
      },
    )

    return response.status(200).json(paginated)
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerClientReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      haveTransactions,
      order,
      orderByColumn,
      isPlaceholder,
    } = form.data

    const report = new ClientsReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
      haveTransactions: haveTransactions === 'true',
      isPlaceholder: isPlaceholder ? isPlaceholder === 'true' : undefined,
    })

    excel.write('Relatório de Cliente.xlsx', response)
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerClientReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      haveTransactions,
      order,
      orderByColumn,
      isPlaceholder,
    } = form.data

    const report = new ClientsReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
      haveTransactions: haveTransactions === 'true',
      isPlaceholder: isPlaceholder ? isPlaceholder === 'true' : undefined,
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
    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      haveTransactions,
      isPlaceholder,
    } = request.query as Record<string, string>

    const hasIsPlaceholderConsumer = !!isPlaceholder

    const parsedIsPlaceholder = isPlaceholder === 'true'
    const parsedHaveTransactions = haveTransactions === 'true'

    const startDate = dateStart
      ? DateTime.fromISO(dateStart)
          .minus({ hours: 3 })
          .startOf('day')
          .toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).minus({ hours: 3 }).endOf('day').toJSDate()
      : undefined

    let consumerAddress

    if (cityId && stateId) {
      consumerAddress = {
        AND: [
          { cityId: filterNumber(cityId) },
          {
            city: { stateId: filterNumber(stateId) },
          },
        ],
      }
    }

    if (!cityId && stateId) {
      consumerAddress = {
        city: { stateId: filterNumber(stateId) },
      }
    }

    const totalShoppingValue = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        consumer: {
          consumerAddress,
          isPlaceholderConsumer: hasIsPlaceholderConsumer
            ? parsedIsPlaceholder
            : undefined,
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    const totalApprovedCashback = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        transactionStatusId: APPROVED_TRANSACTION_STATUS_ID,
        consumer: {
          consumerAddress,
          isPlaceholderConsumer: hasIsPlaceholderConsumer
            ? parsedIsPlaceholder
            : undefined,
        },
      },
      _sum: {
        cashbackAmount: true,
      },
    })

    const consumers = await prisma.consumer.aggregate({
      where: {
        transactions: parsedHaveTransactions
          ? {
              some: {
                createdAt: { gte: startDate, lte: endDate },
              },
            }
          : {
              none: {},
            },
        createdAt: !parsedHaveTransactions
          ? { gte: startDate, lte: endDate }
          : undefined,
        consumerAddress,
        isPlaceholderConsumer: hasIsPlaceholderConsumer
          ? parsedIsPlaceholder
          : undefined,
      },
      _sum: {
        blockedBalance: true,
        balance: true,
      },
      _count: true,
    })

    const registeredConsumers = await prisma.consumer.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        isPlaceholderConsumer: hasIsPlaceholderConsumer
          ? parsedIsPlaceholder
          : undefined,
        consumerAddress,
      },
    })

    return response.status(200).json({
      consumerCount: consumers._count,
      totalShoppingValue: parsedHaveTransactions
        ? +totalShoppingValue._sum.totalAmount
        : 0,
      totalApprovedCashback: parsedHaveTransactions
        ? +totalApprovedCashback._sum.cashbackAmount
        : 0,
      pendingAmount: +consumers._sum.blockedBalance,
      balanceAmount: +consumers._sum.balance,
      registeredConsumers,
    })
  }
}
