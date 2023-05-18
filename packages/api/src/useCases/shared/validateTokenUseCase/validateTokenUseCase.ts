import jwt from "jsonwebtoken";
import { AuthenticationError } from "../../../config/errors";

interface ValidateTokenUseCaseProps {
  token: string;
}

class ValidateTokenUseCase {
  async execute({ token }: ValidateTokenUseCaseProps) {
    if (!token) {
      throw new AuthenticationError("Token inválido");
    }

    const parts = token.split(" ");

    if (parts.length !== 2) {
      throw new AuthenticationError("Token inválido");
    }

    const [schema, value] = parts;

    if (!/^Bearer$/i.test(schema)) {
      throw new AuthenticationError("Token inválido");
    }

    const payload = jwt.verify(
      value,
      process.env.JWT_PRIVATE_KEY,
      (err, decoded) => {
        if (err) {
          throw new AuthenticationError("Token inválido");
        }

        return decoded;
      }
    );

    return payload;
  }
}

export { ValidateTokenUseCase };
