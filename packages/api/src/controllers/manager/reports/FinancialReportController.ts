import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { filterNumber } from '../../../utils'
import { FinancialReport } from '../../../reports/manager/FinancialReport'
import { ManagerFinancialReportRequest } from '../../../requests/reports/manager/ManagerFinancialReportRequest'

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

  async totalizer(request: Request, response: Response) {
    const { dateEnd, dateStart, transactionStatusId, monthlyPayment } =
      request.query as Record<string, string>

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toJSDate()
      : undefined
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).endOf('day').toJSDate()
      : undefined

    const takebackFeeAmount = await prisma.transaction.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        transactionStatusId: filterNumber(transactionStatusId),
      },
      _sum: {
        takebackFeeAmount: true,
      },
    })

    const sellBonusAmount = await prisma.bonus.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: { equals: 'SELL' },
      },
      _sum: {
        value: true,
      },
    })

    const newUserBonusAmount = await prisma.bonus.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: { equals: 'NEW_USER' },
      },
      _sum: {
        value: true,
      },
    })

    const consultantBonusAmount = await prisma.bonus.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: { equals: 'CONSULTANT' },
      },
      _sum: {
        value: true,
      },
    })

    const referralBonusAmount = await prisma.bonus.aggregate({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: { equals: 'REFERRAL' },
      },
      _sum: {
        value: true,
      },
    })

    const companyMonthlyPaymentsAmount =
      await prisma.companyMonthlyPayment.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          isPaid: monthlyPayment === 'true',
        },
        _sum: {
          amountPaid: true,
        },
      })

    const storeOrders = await prisma.storeOrder.findMany({
      select: {
        companyCreditValue: true,
        quantity: true,
        value: true,
      },
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    })

    const { totalStoreBuyValue, totalStoreSellValue } = storeOrders.reduce(
      (acc, { companyCreditValue, value, quantity }) => {
        acc.totalStoreBuyValue += Number(companyCreditValue) * Number(quantity)
        acc.totalStoreSellValue += Number(value) * Number(quantity)
        return acc
      },
      { totalStoreBuyValue: 0, totalStoreSellValue: 0 },
    )

    const balanceAmount =
      +takebackFeeAmount._sum.takebackFeeAmount +
      +companyMonthlyPaymentsAmount._sum.amountPaid +
      totalStoreSellValue -
      +sellBonusAmount._sum.value -
      +newUserBonusAmount._sum.value -
      +consultantBonusAmount._sum.value -
      +referralBonusAmount._sum.value -
      totalStoreBuyValue

    return response.status(200).json({
      totalTakebackFeeAmount: +takebackFeeAmount._sum.takebackFeeAmount,
      companyMonthlyPaymentsAmount:
        +companyMonthlyPaymentsAmount._sum.amountPaid,
      totalStoreSellValue,
      totalStoreBuyValue,
      sellBonusAmount: +sellBonusAmount._sum.value,
      newUserBonusAmount: +newUserBonusAmount._sum.value,
      consultantBonusAmount: +consultantBonusAmount._sum.value,
      referralBonusAmount: +referralBonusAmount._sum.value,
      balanceAmount,
    })
  }
}
