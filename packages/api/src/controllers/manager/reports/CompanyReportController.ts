import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'
import { ManagerCompanyReportRequest } from '../../../requests/reports/manager/ManagerCompanyReportRequest'
import { CompanyReport } from '../../../reports/manager/CompanyReport'

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

  async totalizer(request: Request, response: Response) {
    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      companyStatusId,
      transactionStatusId,
    } = request.query as Record<string, string>

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).startOf('day').toJSDate()
      : undefined

    let companyAddress

    if (cityId && stateId) {
      companyAddress = {
        AND: [
          { cityId: filterNumber(cityId) },
          { city: { stateId: filterNumber(stateId) } },
        ],
      }
    }

    if (cityId || stateId) {
      companyAddress = {
        OR: [
          { cityId: filterNumber(cityId) },
          { city: { stateId: filterNumber(stateId) } },
        ],
      }
    }

    if (!cityId && !stateId) {
      companyAddress = undefined
    }

    const companiesCount = await prisma.company.count({
      where: {
        companyAddress,
        statusId: filterNumber(companyStatusId),
      },
    })

    const positiveBalances = await prisma.company.aggregate({
      where: {
        companyAddress,
        statusId: filterNumber(companyStatusId),
      },
      _sum: {
        positiveBalance: true,
      },
    })

    const cashbacks = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        transactionStatusId: filterNumber(transactionStatusId),
        company: {
          companyAddress,
          statusId: filterNumber(companyStatusId),
        },
      },
      _sum: {
        totalAmount: true,
        takebackFeeAmount: true,
        cashbackAmount: true,
      },
    })

    return response.status(200).json({
      companiesCount,
      totalAmount: cashbacks._sum.totalAmount,
      totalCashbackAmount: cashbacks._sum.cashbackAmount,
      totalTakebackFeeAmount: cashbacks._sum.takebackFeeAmount,
      totalPositiveBalances: positiveBalances._sum.positiveBalance,
    })
  }
}
