import { Request, Response } from 'express'
import { SellersReport } from '../../../reports/manager/SellersReport'
import { InternalError } from '../../../config/GenerateErros'
import { filterNumber } from '../../../utils'
import { ManagerSellerReportRequest } from '../../../requests/reports/manager/ManagerSellerReportRequest'

export interface SellerTotalizer {
  companyCount: number
  newClients: number
  totalTransactions: number
}

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
      cityId,
      companyId,
      stateId,
    } = form.data

    const report = new SellersReport()

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
      cityId: filterNumber(cityId),
      companyId,
      stateId: filterNumber(stateId),
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
      cityId,
      companyId,
      stateId,
    } = form.data

    const report = new SellersReport()

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
      cityId: filterNumber(cityId),
      companyId,
      stateId: filterNumber(stateId),
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
      cityId,
      companyId,
      stateId,
    } = form.data

    const report = new SellersReport()

    const totalizer = await report.getTotalizer<SellerTotalizer>({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
      cityId: filterNumber(cityId),
      companyId,
      stateId: filterNumber(stateId),
    })

    const sumTotalizer = totalizer.reduce(
      (acc, curr) => {
        acc.companyCount += 1
        acc.newClients += curr.newClients
        acc.totalTransactions += curr.totalTransactions
        return acc
      },
      {
        companyCount: 0,
        newClients: 0,
        totalTransactions: 0,
      },
    )

    return response.status(200).json(sumTotalizer)
  }
}
