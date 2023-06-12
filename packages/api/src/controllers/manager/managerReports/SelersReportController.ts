import { Request, Response } from "express";
import { InternalError } from "../../../config/GenerateErros";
import { ManagerSelersReport } from "../../../reports/ManagerSelersReport";
import { ManagerSelersReportRequest } from "../../../requests/reports/ManagerSelersReportRequest";

class SelersReportController {
  async index(request: Request, response: Response) {
    const form = ManagerSelersReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      page,
      dateStart,
      dateEnd,
      citiesIds,
      statesIds,
      company,
      companyStatus,
      office,
      transactionStatus,
      sort,
    } = form.data;

    const report = new ManagerSelersReport();

    const paginated = await report.getPaginated(
      { page: Number(page) },
      {
        dateStart,
        dateEnd,
        citiesIds:
          citiesIds && citiesIds.length
            ? citiesIds.map((id) => Number(id))
            : undefined,
        statesIds:
          statesIds && statesIds.length
            ? statesIds.map((id) => Number(id))
            : undefined,
        company,
        companyStatus: Number(companyStatus),
        office: Number(office),
        transactionStatus: Number(transactionStatus),
        sort,
      }
    );

    return response.status(200).json(paginated);
  }

  async getExcel(request: Request, response: Response) {
    const form = ManagerSelersReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateStart,
      dateEnd,
      citiesIds,
      statesIds,
      company,
      companyStatus,
      office,
      transactionStatus,
      sort,
    } = form.data;

    const report = new ManagerSelersReport();

    const excel = await report.getExcel({
      dateStart,
      dateEnd,
      citiesIds:
        citiesIds && citiesIds.length
          ? citiesIds.map((id) => Number(id))
          : undefined,
      statesIds:
        statesIds && statesIds.length
          ? statesIds.map((id) => Number(id))
          : undefined,
      company,
      companyStatus: Number(companyStatus),
      office: Number(office),
      transactionStatus: Number(transactionStatus),
      sort,
    });

    excel.write("Relatório de Vendedores.xlsx", response);
  }

  async getPdf(request: Request, response: Response) {
    const form = ManagerSelersReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateStart,
      dateEnd,
      citiesIds,
      statesIds,
      company,
      companyStatus,
      office,
      transactionStatus,
      sort,
    } = form.data;

    const report = new ManagerSelersReport();

    const pdf = await report.getPdf({
      dateStart,
      dateEnd,
      citiesIds:
        citiesIds && citiesIds.length
          ? citiesIds.map((id) => Number(id))
          : undefined,
      statesIds:
        statesIds && statesIds.length
          ? statesIds.map((id) => Number(id))
          : undefined,
      company,
      companyStatus: Number(companyStatus),
      office: Number(office),
      transactionStatus: Number(transactionStatus),
      sort,
    });

    response.setHeader("Content-type", "application/pdf");
    response.setHeader(
      "Content-disposition",
      'inline; filename="Relatório de Vendedores.pdf"'
    );

    pdf.pipe(response);
    pdf.end();
  }

  async totalizer(request: Request, response: Response) {
    const form = ManagerSelersReportRequest.safeParse(request.query);

    if (!form.success) {
      throw new InternalError("Existem erros nos filtros", 400);
    }

    const {
      dateStart,
      dateEnd,
      citiesIds,
      statesIds,
      company,
      companyStatus,
      office,
      transactionStatus,
      sort,
    } = form.data;

    const report = new ManagerSelersReport();

    const result = await report.getQuery({
      dateStart,
      dateEnd,
      citiesIds:
        citiesIds && citiesIds.length
          ? citiesIds.map((id) => Number(id))
          : undefined,
      statesIds:
        statesIds && statesIds.length
          ? statesIds.map((id) => Number(id))
          : undefined,
      company,
      companyStatus: Number(companyStatus),
      office: Number(office),
      transactionStatus: Number(transactionStatus),
      sort,
    });

    const totalSales = result.reduce((acc, cur) => {
      return acc + cur.totalAmount;
    }, 0);

    const totalNewClients = result.reduce((acc, cur) => {
      return acc + cur.newClients;
    }, 0);

    return response.status(200).json({
      totalSelers: result.length,
      totalSales,
      totalNewClients,
    });
  }
}

export { SelersReportController };
