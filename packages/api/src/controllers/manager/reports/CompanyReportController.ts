import { Request, Response } from 'express'
import { InternalError } from '../../../config/GenerateErros'
import { filterNumber } from '../../../utils'
import { ManagerCompanyReportRequest } from '../../../requests/reports/manager/ManagerCompanyReportRequest'
import { CompanyReport } from '../../../reports/manager/CompanyReport'

export interface CompanyTotalizer {
  companiesCount: number
  totalAmount: number
  totalCashbackAmount: number
  totalTakebackFeeAmount: number
  totalPositiveBalances: number
}

export class CompanyReportController {
  async index(request: Request, response: Response) {
    const form = ManagerCompanyReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      companyStatusId,
      transactionStatusId,
      cityId,
      stateId,
      order,
      orderByColumn,
      page,
    } = form.data

    const report = new CompanyReport()

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        cityId: filterNumber(cityId),
        order,
        orderByColumn,
        stateId: filterNumber(stateId),
        companyStatusId: filterNumber(companyStatusId),
        transactionStatusId: filterNumber(transactionStatusId),
      },
    )

    return response.status(200).json(paginated)
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerCompanyReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      companyStatusId,
      transactionStatusId,
      cityId,
      stateId,
      order,
      orderByColumn,
    } = form.data

    const report = new CompanyReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
      companyStatusId: filterNumber(companyStatusId),
      transactionStatusId: filterNumber(transactionStatusId),
    })

    excel.write('Relatório de Cliente.xlsx', response)
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerCompanyReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      companyStatusId,
      transactionStatusId,
      cityId,
      stateId,
      order,
      orderByColumn,
    } = form.data

    const report = new CompanyReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
      companyStatusId: filterNumber(companyStatusId),
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
    const form = ManagerCompanyReportRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const {
      dateEnd,
      dateStart,
      companyStatusId,
      transactionStatusId,
      cityId,
      stateId,
      order,
      orderByColumn,
    } = form.data

    const report = new CompanyReport()

    const totalizer = await report.getTotalizer<CompanyTotalizer>({
      dateEnd,
      dateStart,
      cityId: filterNumber(cityId),
      order,
      orderByColumn,
      stateId: filterNumber(stateId),
      companyStatusId: filterNumber(companyStatusId),
      transactionStatusId: filterNumber(transactionStatusId),
    })

    const sumTotalizer = totalizer.reduce((acc, curr) => {
      acc.companiesCount += curr.companiesCount
      acc.totalAmount += curr.totalAmount
      acc.totalCashbackAmount += curr.totalCashbackAmount
      acc.totalPositiveBalances += curr.totalPositiveBalances
      acc.totalTakebackFeeAmount += curr.totalTakebackFeeAmount
      return acc
    })

    return response.status(200).json(sumTotalizer)
  }
}
