import { Request, Response } from "express";

import { FindCompanyUsersUseCase } from "./FindCompanyUsersUseCase";
import { RegisterCompanyUsersUseCase } from "./RegisterCompanyUsersUseCase";
import { UpdateCompanyPasswordUseCase } from "./UpdateCompanyUserPasswordUseCase";
import { UpdateCompanyUsersUseCase } from "./UpdateCompanyUsersUseCase";
import { RootUserUpdateCompanyUserPasswordUseCase } from "./RootUserUpdateCompanyUserPasswordUseCase";
import { RegisterCpfUserRootUseCase } from "./RegisterCpfUserRootUseCase";

class CompanyUserController {
  async findCompanyUsers(request: Request, response: Response) {
    const { companyId, office, isRootUser } = request["tokenPayload"];

    const findCompanyUsers = new FindCompanyUsersUseCase();

    const result = await findCompanyUsers.execute({
      companyId,
      isRootUser,
      office,
    });

    return response.status(200).json(result);
  }

  async registerCompanyUserRootCPF(request: Request, response: Response) {
    const { userId } = request["tokenPayload"];
    const { cpf } = request.body;

    const registerCpf = new RegisterCpfUserRootUseCase();

    const result = await registerCpf.execute({
      userId,
      cpf,
    });

    return response.status(200).json(result);
  }

  async registerCompanyUser(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { name, password, userTypeId, email, cpf } = request.body;

    const registerCompanyUser = new RegisterCompanyUsersUseCase();

    const result = await registerCompanyUser.execute({
      companyId,
      name,
      password,
      userTypeId: Number(userTypeId),
      email,
      cpf,
    });

    return response.status(200).json(result);
  }

  async updateCompanyUser(request: Request, response: Response) {
    const { companyId, isRootUser } = request["tokenPayload"];
    const { isActive, name, userTypeId, email, cpf } = request.body;
    const { id } = request.params;

    const updateCompanyUser = new UpdateCompanyUsersUseCase();

    const result = await updateCompanyUser.execute({
      companyId,
      isActive,
      name,
      email,
      cpf,
      userId: id,
      userTypeId,
      isRootUser,
    });

    return response.status(200).json(result);
  }

  async updatePassword(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];

    const { newPassword, password } = request.body;

    const update = new UpdateCompanyPasswordUseCase();

    const result = await update.execute({
      newPassword,
      password,
      companyId: companyId,
      userId,
    });

    return response.status(200).json(result);
  }

  async rootUserUpdateUserPassword(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const userToUpdateId = request.params.id;

    const { userName, newPassword } = request.body;

    const update = new RootUserUpdateCompanyUserPasswordUseCase();

    const message = await update.execute({
      userName,
      userToUpdateId,
      companyId: companyId,
      newPassword,
      userId,
    });

    return response.status(200).json({ message });
  }
}

export { CompanyUserController };
