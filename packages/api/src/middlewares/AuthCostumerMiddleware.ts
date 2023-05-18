import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { InternalError } from "../config/GenerateErros";
import { Consumers } from "../database/models/Consumer";

export const AuthCostumerMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { id } = request["tokenPayload"];

  if (!id) {
    throw new InternalError("Não autorizado", 401);
  }

  const consumer = await getRepository(Consumers).findOne(id);

  if (!consumer) {
    throw new InternalError("Não autorizado", 401);
  }

  if (consumer.deactivedAccount) {
    throw new InternalError("Não autorizado", 401);
  }

  next();
};
