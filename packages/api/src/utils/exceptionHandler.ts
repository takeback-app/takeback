import { isDevelopment } from "./index";
import { InternalError } from "../@types/error";

export function exceptionHandler(err: InternalError) {
  if (isDevelopment()) {
    console.error(err);
  }

  if (!err.statusCode) {
    err.message = "Erro Interno do Servidor";
    err.statusCode = 500;
  }

  return {
    name: err.name,
    status: err.statusCode,
    message: err.message,
    stack: isDevelopment() ? err.stack : undefined,
  };
}
