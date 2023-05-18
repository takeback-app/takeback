import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { InternalError } from "../config/GenerateErros";
import { Companies } from "../database/models/Company";
import { SupportUsers } from "../database/models/SupportUsers";

export const AuthCompanyMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { companyId, cpf, office, isRootUser } = request["tokenPayload"];

  if (!companyId) {
    throw new InternalError("Não autorizado", 401);
  }

  const company = await getRepository(Companies).findOne({
    select: ["id", "status", "permissionToSupportAccess"],
    relations: ["status"],
    where: { id: companyId },
    cache: true,
  });

  if (!company) {
    throw new InternalError("Não autorizado", 401);
  }

  if (company.status.blocked) {
    throw new InternalError("Não autorizado", 401);
  }

  if (company.permissionToSupportAccess && office.toLowerCase() === "suporte") {
    const user = await getRepository(SupportUsers).findOne({
      select: ["isActive"],
      where: { cpf },
    });

    if (!user.isActive) {
      throw new InternalError("Acesso negado.", 401);
    }
  }

  next();
};
