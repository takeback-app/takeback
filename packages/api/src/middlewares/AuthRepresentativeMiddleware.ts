import { NextFunction, Request, Response } from "express";
import { InternalError } from "../config/GenerateErros";
import { prisma } from "../prisma";

export const AuthRepresentativeMiddleware = async (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  const { id } = request["tokenPayload"];

  if (!id) {
    throw new InternalError("Não autorizado", 401);
  }

  const user = await prisma.representativeUser.findUnique({
    where: { id },
    include: { representative: { select: { isActive: true } } },
  });

  if (!user || !user.isActive || !user.representative.isActive) {
    throw new InternalError("Não autorizado", 401);
  }

  next();
};
