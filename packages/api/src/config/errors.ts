export class GenericError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number, name?: string) {
    super();
    this.name = name ? name : "Erro";
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;

  constructor(message?: string, name?: string) {
    super();
    this.name = name ? name : "Authentication error";
    this.message = message ? message : "Não autenticado";
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  public statusCode: number;

  constructor(message?: string, name?: string) {
    super();
    this.name = name ? name : "Authorization error";
    this.message = message ? message : "Não autorizado";
    this.statusCode = 403;
  }
}

export class AlreadyExistsError extends Error {
  public statusCode: number;

  constructor(message?: string, name?: string) {
    super();
    this.name = name ? name : "Already exists error";
    this.message = message ? message : "Já cadastrado";
    this.statusCode = 409;
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message?: string, name?: string) {
    super();
    this.name = name ? name : "Not found";
    this.message = message ? message : "Não encontrado";
    this.statusCode = 404;
  }
}
