import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const DecodeTokenMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(498).json({ message: "Token não informado" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return response.status(498).json({ message: "Erro no token" });
    }

    const [schema, token] = parts;

    if (!/^Bearer$/i.test(schema)) {
      return response.status(498).json({ message: "Token mau formado" });
    }

    const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    request["tokenPayload"] = payload;

    next();
  } catch (error) {
    response.status(498).json({ message: "Não autorizado" });
  }
};
