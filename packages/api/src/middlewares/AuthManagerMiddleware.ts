import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { InternalError } from "../config/GenerateErros";
import { TakeBackUsers } from "../database/models/TakeBackUsers";

export const AuthManagerMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request["tokenPayload"];

  if (!id) {
    throw new InternalError("Não autorizado", 401);
  }

  const takeBackUser = await getRepository(TakeBackUsers).findOne(id);

  if (!takeBackUser || !takeBackUser.isActive) {
    throw new InternalError("Não autorizado", 401);
  }

  if (!takeBackUser.isActive) {
    throw new InternalError("Não autorizado", 401);
  }

  next();
};
