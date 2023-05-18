import { Request, Response } from "express";
import { FindCompanyDataUseCase } from "./FindCompanyDataUseCase";
import { FindIndustriesUseCase } from "./FindIndustriesUseCase";
import { UpdateCompanyDataUseCase } from "./UpdateCompanyDataUseCase";

class CompanyDataController {
  async findCompanyData(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyData = new FindCompanyDataUseCase();

    const result = await findCompanyData.execute({ companyId });

    return response.status(200).json(result);
  }

  async updateCompanyData(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const {
      corporateName,
      email,
      fantasyName,
      phone,
      contactPhone,
      useCashbackAsBack,
    } = request.body;

    const updateCompany = new UpdateCompanyDataUseCase();

    const result = await updateCompany.execute({
      companyId,
      corporateName,
      email,
      fantasyName,
      phone,
      contactPhone,
      useCashbackAsBack,
    });

    return response.status(200).json(result);
  }

  async findIndustries(_request: Request, response: Response) {
    const findIndustries = new FindIndustriesUseCase();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
  }
}

export { CompanyDataController };
