import { Request, Response } from "express";
import { ManagerFinancialReportRequest } from "../../../requests/reports/ManagerFinancialReportRequest";
import { InternalError } from "../../../config/GenerateErros";
import { ManagerFinancialReport } from "../../company/reports/ManagerFinancialReport";

export class FinancialReportController {
  async index(request: Request, response: Response) {
    const form = ManagerFinancialReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      page,
      dateStart,
      dateEnd,
      citiesIds,
      statesIds,
      transactionStatus,
      monthlyPaymentStatus,
    } = form.data;

    const report = new ManagerFinancialReport();

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateEnd,
        dateStart,
        citiesIds:
          citiesIds && citiesIds.length
            ? citiesIds.map((id) => Number(id))
            : undefined,
        statesIds:
          statesIds && statesIds.length
            ? statesIds.map((id) => Number(id))
            : undefined,
        monthlyPaymentStatus: Number(monthlyPaymentStatus),
        transactionStatus: Number(transactionStatus),
      }
    );

    return response.status(200).json(paginated);
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerFinancialReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateStart,
      dateEnd,
      orderByColumn,
      order,
      transactionStatus,
      monthlyPaymentStatus,
    } = form.data;

    const report = new ManagerFinancialReport();

    const excel = await report.getExcel({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      monthlyPaymentStatus: Number(monthlyPaymentStatus),
      transactionStatus: Number(transactionStatus),
    });

    excel.write("Relatório Financeiro.xlsx", response);
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerFinancialReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateStart,
      dateEnd,
      orderByColumn,
      order,
      transactionStatus,
      monthlyPaymentStatus,
    } = form.data;

    const report = new ManagerFinancialReport();

    const pdf = await report.getPdf({
      dateEnd,
      dateStart,
      order,
      orderByColumn,
      monthlyPaymentStatus: Number(monthlyPaymentStatus),
      transactionStatus: Number(transactionStatus),
    });

    response.setHeader("Content-type", "application/pdf");
    response.setHeader(
      "Content-disposition",
      'inline; filename="Relatório Financeiro.pdf"'
    );

    pdf.pipe(response);
    pdf.end();
  }
}
