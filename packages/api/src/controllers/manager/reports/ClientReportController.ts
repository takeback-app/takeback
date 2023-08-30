import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { ClientsReport } from './../../../reports/manager/ClientsReport'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'
import { ManagerClientReportRequest } from '../../../requests/reports/manager/ManagerClientReportRequest'

export interface ClientTotalizer {
  balanceAmount: number
  consumerCount: number
  pendingAmount: number
  totalApprovedCashback: number
  totalShoppingValue: number
  registeredConsumers?: number
}
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

  async getTotalizer(request: Request, response: Response) {
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
      isPlaceholder,
    } = form.data

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

    const report = new ClientsReport()

    const totalizer = await report.getTotalizer<ClientTotalizer>({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      stateId: filterNumber(stateId),
      haveTransactions: haveTransactions === 'true',
      isPlaceholder: isPlaceholder ? isPlaceholder === 'true' : undefined,
    })

    const sumTotalizer = totalizer.reduce((acc, curr) => {
      acc.balanceAmount += curr.balanceAmount
      acc.consumerCount += curr.consumerCount
      acc.pendingAmount += curr.pendingAmount
      acc.totalApprovedCashback += curr.totalApprovedCashback
      acc.totalShoppingValue += curr.totalShoppingValue
      return acc
    })

    sumTotalizer.registeredConsumers = await prisma.consumer.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        isPlaceholderConsumer: isPlaceholder
          ? isPlaceholder === 'true'
          : undefined,
        consumerAddress,
      },
    })

    return response.status(200).json(sumTotalizer)
  }
}
