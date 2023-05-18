import { Request, Response } from "express";
import { FindUserCompaniesUseCase } from "./FindUserCompaniesUseCase";
import { UpdateUserCompaniesUseCase } from "./UpdateUserCompaniesUseCase";

class UserCompaniesController {
  async findUserCompanies(request: Request, response: Response) {
    const { id } = request.params;
    const findUserCompanies = new FindUserCompaniesUseCase();

    const result = await findUserCompanies.execute({
      companyId: id,
    });

    return response.status(200).json(result);
  }

  async updateUserFromCompany(request: Request, response: Response) {
    const { isActive, isRootUser, name, userTypeId, email, cpf } = request.body;
    const { id } = request.params;

    const updateCompanyUser = new UpdateUserCompaniesUseCase();

    const result = await updateCompanyUser.execute({
      isActive,
      name,
      email,
      isRootUser,
      cpf,
      userId: id,
      userTypeId,
    });

    return response.status(200).json(result);
  }
}

export { UserCompaniesController };
