import { Request, Response } from "express";
import { CompanyPermissionToSupportUseCase } from "./CompanyPermissionToSupportUseCase";
import { FindStatusPermissionToSupportUseCase } from "./FindStatusPermissionToSupportUseCase";

class CompanySupportController {
  async updatePermission(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const { permission } = request.body;

    const update = new CompanyPermissionToSupportUseCase();
    const find = new FindStatusPermissionToSupportUseCase();

    const message = await update.execute({
      companyId,
      userId,
      permission,
    });

    const permissionStatus = await find.execute({
      companyId,
    });

    return response.status(200).json({ message, permissionStatus });
  }

  async findPermission(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const find = new FindStatusPermissionToSupportUseCase();

    const result = await find.execute({
      companyId,
    });

    return response.status(200).json(result);
  }
}

export { CompanySupportController };
