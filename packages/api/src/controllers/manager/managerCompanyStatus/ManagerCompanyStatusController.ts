import { Request, Response } from "express";
import { FindCompanyStatusUseCase } from "./FindCompanyStatusUseCase";
import { UpdadeCompanyStatusUseCase } from "./UpdateCompanyStatusUseCase";
import { FindOneCompanyUseCase } from "../managerCompanies/FindOneCompanyUseCase";
import { GenerateProvisionalAccessUseCase } from "./GenerateProvisionalAccessUseCase";

class ManagerCompanyStatusController {
  async findCompanyStatus(request: Request, response: Response) {
    const findStatus = new FindCompanyStatusUseCase();

    const result = await findStatus.execute();

    return response.status(200).json(result);
  }

  async updateCompanyStatus(request: Request, response: Response) {
    const companyId = request.params.id;
    const { statusId } = request.body;

    const udpate = new UpdadeCompanyStatusUseCase();
    const findCompanyData = new FindOneCompanyUseCase();

    const message = await udpate.execute({
      companyId,
      statusId,
    });

    const companyData = await findCompanyData.execute({ companyId });

    return response.status(200).json({ message, companyData });
  }

  async generateProvisionalAccess(request: Request, response: Response) {
    const companyId = request.params.id;

    const generate = new GenerateProvisionalAccessUseCase();

    const message = await generate.execute({ companyId });

    return response.status(200).json({ message });
  }
}

export { ManagerCompanyStatusController };
