import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { ManagerCashbackReportRequest } from '../../../requests/reports/manager/ManagerCashbackReportRequest'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'
import { CashbacksReport } from '../../../reports/manager/CashbacksReport'

export class CashbackReportController {
  async index(request: Request, response: Response) {
    const form = ManagerCashbackReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      cityId,
      companyId,
      companyStatusId,
      companyUserId,
      stateId,
      transactionStatusId,
      paymentMethodId,
      order,
      orderByColumn,
      page,
    } = form.data

    const report = new CashbacksReport()

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        order,
        orderByColumn,
        cityId: filterNumber(cityId),
        companyId,
        companyStatusId: filterNumber(companyStatusId),
        companyUserId,
        stateId: filterNumber(stateId),
        transactionStatusId: filterNumber(transactionStatusId),
        paymentMethodId: filterNumber(paymentMethodId),
      },
    )

    return response.status(200).json(paginated)
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerCashbackReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      cityId,
      companyId,
      companyStatusId,
      companyUserId,
      stateId,
      transactionStatusId,
      paymentMethodId,
      order,
      orderByColumn,
    } = form.data

    const report = new CashbacksReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      cityId: filterNumber(cityId),
      companyId,
      companyStatusId: filterNumber(companyStatusId),
      companyUserId,
      stateId: filterNumber(stateId),
      transactionStatusId: filterNumber(transactionStatusId),
      paymentMethodId: filterNumber(paymentMethodId),
    })

    excel.write('Relatório de Vendedor.xlsx', response)
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerCashbackReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      cityId,
      companyId,
      companyStatusId,
      companyUserId,
      stateId,
      transactionStatusId,
      paymentMethodId,
    } = form.data

    const report = new CashbacksReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      cityId: filterNumber(cityId),
      companyId,
      companyStatusId: filterNumber(companyStatusId),
      companyUserId,
      stateId: filterNumber(stateId),
      transactionStatusId: filterNumber(transactionStatusId),
      paymentMethodId: filterNumber(paymentMethodId),
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
    const { dateEnd, dateStart, stateId, cityId, companyStatusId } =
      request.query as Record<string, string>

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).startOf('day').toJSDate()
      : undefined

    const cashbacks = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        company: {
          companyAddress: {
            AND: [
              { cityId: filterNumber(cityId) },
              { city: { stateId: filterNumber(stateId) } },
            ],
          },
          statusId: filterNumber(companyStatusId),
        },
        transactionPaymentMethods: {
          some: {
            companyPaymentMethod: { isNot: undefined },
          },
        },
      },
      _count: true,
      _sum: {
        totalAmount: true,
        takebackFeeAmount: true,
        backAmount: true,
        cashbackAmount: true,
      },
    })

    const totalToPay =
      +cashbacks._sum.cashbackAmount +
      +cashbacks._sum.takebackFeeAmount +
      +cashbacks._sum.backAmount

    return response.json({
      totalCashbackCount: cashbacks._count,
      totalAmount: cashbacks._sum.totalAmount,
      totalTakebackFeeAmount: cashbacks._sum.takebackFeeAmount,
      totalBackAmount: cashbacks._sum.backAmount,
      totalCashbackAmount: cashbacks._sum.cashbackAmount,
      totalToPay,
    })
  }
}
