import jwt from "jsonwebtoken";

// This feature will be discontinued soon.
export function generateToken(payload, privateKey, expiresIn) {
  const token = jwt.sign(payload, privateKey, {
    // algorithm: 'RS256', // This algorith require private key generate
    expiresIn,
  });

  return token;
}

export function generateJWTToken(payload, privateKey, expiresIn) {
  const token = jwt.sign(payload, privateKey, {
    expiresIn,
  });

  return token;
}

export function verifyToken(authHeader, hash): void | Error | any {
  if (!authHeader) return new Error("Token nao informado");

  const parts = authHeader.split(" ");

  if (parts.length !== 2) return new Error("Erro no Token");

  const [schema, token] = parts;

  if (!/^Bearer$/i.test(schema)) return new Error("Token mau formado");

  const authPayload = jwt.verify(token, hash, (err, payload) => {
    if (err) return new Error("Token inválido");

    return payload;
  });

  return authPayload;
}
