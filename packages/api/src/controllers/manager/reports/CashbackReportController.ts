import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { ManagerCashbackReportRequest } from '../../../requests/reports/ManagerCashbackReportRequest'
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
      order,
      orderByColumn,
      page,
      cashbackStatus,
      paymentMethodType,
    } = form.data

    const report = new CashbacksReport()

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        order,
        orderByColumn,
        cashbackStatus: filterNumber(cashbackStatus),
        paymentMethodType: filterNumber(paymentMethodType),
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
      order,
      orderByColumn,
      paymentMethodType,
      cashbackStatus,
    } = form.data

    const report = new CashbacksReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      paymentMethodType: filterNumber(paymentMethodType),
      cashbackStatus: filterNumber(cashbackStatus),
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
      paymentMethodType,
      cashbackStatus,
    } = form.data

    const report = new CashbacksReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      paymentMethodType: filterNumber(paymentMethodType),
      cashbackStatus: filterNumber(cashbackStatus),
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

    const { dateEnd, dateStart } = request.query as Record<string, string>

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).startOf('day').toJSDate()
      : undefined

    const cashbacks = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        createdAt: { gte: startDate, lte: endDate },
        // transactionStatusId: filterNumber(cashbackStatus),
        transactionPaymentMethods: {
          some: {
            companyPaymentMethod: {
              // paymentMethodId: filterNumber(paymentMethodType),
            },
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
