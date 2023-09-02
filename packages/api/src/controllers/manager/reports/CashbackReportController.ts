import { Request, Response } from 'express'
import { ManagerCashbackReportRequest } from '../../../requests/reports/manager/ManagerCashbackReportRequest'
import { InternalError } from '../../../config/GenerateErros'
import { filterNumber } from '../../../utils'
import { CashbacksReport } from '../../../reports/manager/CashbacksReport'

export interface CashbackTotalizer {
  totalCashbackCount: number
  totalAmount: number
  totalTakebackFeeAmount: number
  totalBackAmount: number
  totalCashbackAmount: number
}

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

  async getTotalizer(request: Request, response: Response) {
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

    const totalizer = await report.getTotalizer<CashbackTotalizer>({
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

    const sumTotalizer = totalizer.reduce(
      (acc, curr) => {
        acc.totalCashbackCount += 1
        acc.totalAmount += curr.totalAmount
        acc.totalTakebackFeeAmount += curr.totalTakebackFeeAmount
        acc.totalBackAmount += curr.totalBackAmount
        acc.totalCashbackAmount += curr.totalCashbackAmount

        return acc
      },
      {
        totalCashbackCount: 0,
        totalAmount: 0,
        totalTakebackFeeAmount: 0,
        totalBackAmount: 0,
        totalCashbackAmount: 0,
      },
    )

    return response.status(200).json(sumTotalizer)
  }
}
