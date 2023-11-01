import { Request, Response } from 'express'
import { InternalError } from '../../../config/GenerateErros'
import { filterNumber } from '../../../utils'
import { FinancialReport } from '../../../reports/manager/FinancialReport'
import { ManagerFinancialReportRequest } from '../../../requests/reports/manager/ManagerFinancialReportRequest'

export interface FinancialTotalizer {
  totalTakebackFeeAmount: number
  companyMonthlyPaymentsAmount: number
  totalStoreSellValue: number
  totalStoreBuyValue: number
  sellBonusAmount: number
  newUserBonusAmount: number
  consultantBonusAmount: number
  referralBonusAmount: number
  commissionValueAmount: number
  depositFeeValue: number
  expiredBalances: number
}

export class FinancialReportController {
  async index(request: Request, response: Response) {
    const form = ManagerFinancialReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      transactionStatusId,
      monthlyPayment,
      order,
      orderByColumn,
      page,
    } = form.data

    const report = new FinancialReport()

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        order,
        orderByColumn,
        monthlyPayment,
        transactionStatusId: filterNumber(transactionStatusId),
      },
    )

    return response.status(200).json(paginated)
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerFinancialReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      transactionStatusId,
      monthlyPayment,
      order,
      orderByColumn,
    } = form.data

    const report = new FinancialReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      monthlyPayment,
      transactionStatusId: filterNumber(transactionStatusId),
    })

    excel.write('Relatório de Cliente.xlsx', response)
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerFinancialReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      transactionStatusId,
      monthlyPayment,
      order,
      orderByColumn,
    } = form.data

    const report = new FinancialReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      monthlyPayment,
      transactionStatusId: filterNumber(transactionStatusId),
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
    const form = ManagerFinancialReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      transactionStatusId,
      monthlyPayment,
      order,
      orderByColumn,
    } = form.data

    const report = new FinancialReport()

    const [totalizer] = await report.getTotalizer<FinancialTotalizer>({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      monthlyPayment,
      transactionStatusId: filterNumber(transactionStatusId),
    })

    return response.status(200).json(totalizer)
  }
}
