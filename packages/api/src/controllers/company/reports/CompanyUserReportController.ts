import { Request, Response } from "express";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsersReport } from "../../../reports/CompanyUsersReport";
import { CompanyUserReportRequest } from "../../../requests/reports/CompanyUserReportRequest";
import { prisma } from "../../../prisma";
import { DateTime } from "luxon";
import { filterNumber } from "../../../utils";

export class CompanyUserReportController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CompanyUserReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      page,
      office,
      transactionStatus,
    } = form.data;

    const report = new CompanyUsersReport(companyId);

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        order,
        orderByColumn,
        office: filterNumber(office),
        transactionStatus: filterNumber(transactionStatus),
      }
    );

    return response.status(200).json(paginated);
  }

  async getExcel(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CompanyUserReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office,
      transactionStatus,
    } = form.data;

    const report = new CompanyUsersReport(companyId);

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
    });

    excel.write("Relatório de Vendedor.xlsx", response);
  }

  async getPdf(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const form = CompanyUserReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office,
      transactionStatus,
    } = form.data;

    const report = new CompanyUsersReport(companyId);

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      office: filterNumber(office),
      transactionStatus: filterNumber(transactionStatus),
    });

    response.setHeader("Content-type", "application/pdf");
    response.setHeader(
      "Content-disposition",
      'inline; filename="Relatório de Vendedor.pdf"'
    );

    pdf.pipe(response);
    pdf.end();
  }

  async totalizer(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { dateEnd, dateStart, office, transactionStatus } =
      request.query as Record<string, string>;

    const startDate = dateStart
      ? DateTime.fromISO(dateStart).startOf("day").toJSDate()
      : undefined;
    const endDate = dateEnd
      ? DateTime.fromISO(dateEnd).startOf("day").toJSDate()
      : undefined;

    const consumerCount = await prisma.companyUser.count({
      where: {
        companyId: companyId,
        companyUserTypesId: filterNumber(office),
        transactions: {
          some: {
            createdAt: { gte: startDate, lte: endDate },
            transactionStatusId: filterNumber(transactionStatus),
          },
        },
      },
    });

    const totalTransactions = await prisma.transaction.aggregate({
      where: {
        companiesId: companyId,
        createdAt: { gte: startDate, lte: endDate },
        companyUsersId: { not: null },
        companyUser: {
          companyUserTypesId: filterNumber(office),
        },
        transactionStatusId: filterNumber(transactionStatus),
      },
      _sum: {
        totalAmount: true,
      },
    });

    const newClients = await prisma.bonus.count({
      where: {
        type: "NEW_USER",
        transaction: {
          companiesId: companyId,
          createdAt: { gte: startDate, lte: endDate },
          transactionStatusId: filterNumber(transactionStatus),
          companyUser: {
            companyUserTypesId: filterNumber(office),
          },
        },
      },
    });

    return response.json({
      consumerCount,
      totalTransactions: totalTransactions._sum.totalAmount,
      newClients,
    });
  }
}
