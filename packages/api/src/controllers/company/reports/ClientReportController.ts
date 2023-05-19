import { Request, Response } from "express";
import { CompanyClientsReport } from "../../../reports/CompanyClientsReport";
import { CompanyClientReportRequest } from "../../../requests/reports/CompanyClientReportRequest";
import { InternalError } from "../../../config/GenerateErros";
import { prisma } from "../../../prisma";
import { TransactionStatusEnum } from "../../../enum/TransactionStatusEnum";
import { DateTime } from "luxon";

export class ClientReportController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const paymentPlan = await prisma.paymentPlan.findFirst({
      where: { companies: { some: { id: companyId } } },
      select: { canAccessClientReport: true },
    });

    if (!paymentPlan.canAccessClientReport) {
      throw new InternalError("Você não tem acesso a este relatório", 403);
    }

    const form = CompanyClientReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const { dateEnd, dateStart, order, orderByColumn, page } = form.data;

    const report = new CompanyClientsReport(companyId);

    const paginated = await report.getPaginated(
      { page: Number(page) },
      { dateEnd, dateStart, order, orderByColumn }
    );

    return response.status(200).json(paginated);
  }

  async getExcel(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CompanyClientReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const { dateEnd, dateStart, order, orderByColumn } = form.data;

    const report = new CompanyClientsReport(companyId);

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
    });

    excel.write("Relatório de Cliente.xlsx", response);
  }

  async getPdf(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CompanyClientReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const { dateEnd, dateStart, order, orderByColumn } = form.data;

    const report = new CompanyClientsReport(companyId);

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
    });

    response.setHeader("Content-type", "application/pdf");
    response.setHeader(
      "Content-disposition",
      'inline; filename="Relatório de Cliente.pdf"'
    );

    pdf.pipe(response);
    pdf.end();
  }

  async totalizer(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { dateEnd, dateStart } = request.query as Record<string, string>;

    const startDate = DateTime.fromISO(dateStart).startOf("day").toJSDate();
    const endDate = DateTime.fromISO(dateEnd).startOf("day").toJSDate();

    const consumerCount = await prisma.consumer.count({
      where: {
        transactions: {
          some: {
            companiesId: companyId,
            createdAt: { gte: startDate, lte: endDate },
          },
        },
      },
    });

    const totalShoppingValue = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const totalApprovedCashback = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        createdAt: { gte: startDate, lte: endDate },
        transactionStatus: {
          description: {
            in: [TransactionStatusEnum.APPROVED],
          },
        },
      },
      _sum: {
        cashbackAmount: true,
      },
    });

    const totalVisits = await prisma.transaction.count({
      where: {
        companiesId: companyId,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    return response.status(200).json({
      consumerCount,
      totalShoppingValue: totalShoppingValue._sum.totalAmount,
      totalApprovedCashback: totalApprovedCashback._sum.cashbackAmount,
      totalVisits,
    });
  }
}
