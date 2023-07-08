import { NextFunction, Request, Response } from "express";
import { InternalError } from "../config/GenerateErros";
import { prisma } from "../prisma";

export const AuthIntegrationMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  const companyId = request["companyId"];

  if (!companyId) {
    throw new InternalError("Não autorizado", 401);
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { paymentPlan: { select: { canUseIntegration: true } }, integrationSettings: true },
  });

  if (!company || !company.paymentPlan.canUseIntegration) {
    throw new InternalError("Não autorizado", 401);
  }

  if (!company.integrationSettings) {
    throw new InternalError("Integração não configurada", 403);
  }

  next();
};
