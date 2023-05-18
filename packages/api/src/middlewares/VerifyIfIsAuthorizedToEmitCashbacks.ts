import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { InternalError } from "../config/GenerateErros";
import { Companies } from "../database/models/Company";

export const VerifyIfIsAuthorizedToEmitCashbacks = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { companyId } = request["tokenPayload"];

  const company = await getRepository(Companies).findOne({
    where: { id: companyId },
    select: ["status", "id"],
    relations: ["status"],
  });

  // Verificando se a empresa tem permissão para emitir cashbacks
  if (!company.status.generateCashback) {
    throw new InternalError("Sem permissão para emitir cashbacks", 400);
  }

  next();
};
