import { Request, Response } from "express";
import { FindCompaniesUseCase } from "./FindCompaniesUseCase";
import { FindCompaniesFiltersUseCase } from "./FindCompaniesFiltersUseCase";

class CostumerCompaniesController {
  async findCompanies(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const filters = request.query;

    const find = new FindCompaniesUseCase();

    const companies = await find.execute({ userId: id, filters });

    response.status(200).json(companies);
  }

  async findCompanyFilters(request: Request, response: Response) {
    const find = new FindCompaniesFiltersUseCase();

    const filters = await find.execute();

    response.status(200).json(filters);
  }
}

export { CostumerCompaniesController };
