import { Request, Response } from "express";
import { CompanyReportRequest } from "../../../requests/reports/CompanyReportRequest";
import { InternalError } from "../../../config/GenerateErros";
import { ManagerCompanyReport } from "../../../reports/ManagerCompanyReport";

class CompaniesReportController {
  async index(request: Request, response: Response) {
    const form = CompanyReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      page,
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    } = form.data;

    const report = new ManagerCompanyReport();

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dataCreatedEnd,
        dataCreatedStart,
        cashbacksStatusIds,
        company,
        dataActivateEnd,
        dataActivateStart,
        industryIds,
        sort,
        statusIds,
      }
    );

    return response.status(200).json(paginated);
  }

  async getExcel(request: Request, response: Response) {
    const form = CompanyReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    } = form.data;

    const report = new ManagerCompanyReport();

    const excel = await report.getExcel({
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    });

    excel.write("Relatório de Empresas.xlsx", response);
  }

  async getPdf(request: Request, response: Response) {
    const form = CompanyReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    } = form.data;

    const report = new ManagerCompanyReport();

    const pdf = await report.getPdf({
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    });

    response.setHeader("Content-type", "application/pdf");
    response.setHeader(
      "Content-disposition",
      'inline; filename="Relatório de Empresas.pdf"'
    );

    pdf.pipe(response);
    pdf.end();
  }

  async totalizer(request: Request, response: Response) {
    const form = CompanyReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      page,
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    } = form.data;

    const report = new ManagerCompanyReport();

    const result = await report.getQuery({
      dataCreatedEnd,
      dataCreatedStart,
      cashbacksStatusIds,
      company,
      dataActivateEnd,
      dataActivateStart,
      industryIds,
      sort,
      statusIds,
    });

    const totalBilling = result.reduce((acc, curr) => {
      return acc + curr.valueOfTotalAmount;
    }, 0);

    const totalCashbacksValues = result.reduce((acc, curr) => {
      return acc + curr.valueOfCashbacks;
    }, 0);

    const totalInBalance = result.reduce((acc, curr) => {
      return acc + curr.valueOfPaidTransactions;
    }, 0);

    return response.status(200).json({
      totalCompanies: result.length,
      totalBilling,
      totalCashbacksValues,
      totalInBalance,
    });
  }
}

export { CompaniesReportController };
