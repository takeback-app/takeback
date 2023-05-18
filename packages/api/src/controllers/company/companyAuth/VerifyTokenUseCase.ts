import jwt from "jsonwebtoken";
import { InternalError } from "../../../config/GenerateErros";

interface Props {
  token: string;
}

class VerifyTokenUseCase {
  async execute({ token }: Props) {
    if (!token) {
      throw new InternalError("Token inválido", 498);
    }

    const parts = token.split(" ");

    if (parts.length !== 2) {
      throw new InternalError("Token inválido", 498);
    }

    const [schema, value] = parts;

    if (!/^Bearer$/i.test(schema)) {
      throw new InternalError("Token inválido", 498);
    }

    const payload = jwt.verify(
      value,
      process.env.JWT_PRIVATE_KEY,
      (err, decoded) => {
        if (err) {
          throw new InternalError("Token inválido", 498);
        }

        return decoded;
      }
    );

    return payload;
  }
}

export { VerifyTokenUseCase };
