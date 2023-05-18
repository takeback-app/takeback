import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface VerifyEmailProps {
  consumerID: string;
  code: string;
}

class CostumerVerifyEmailUseCase {
  async execute({ code, consumerID }: VerifyEmailProps) {
    if (!code) {
      throw new InternalError("Dados não informados", 400);
    }

    const consumer = await getRepository(Consumers).findOne(consumerID);

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (consumer.codeToConfirmEmail !== code) {
      throw new InternalError("Falha na validação do email", 400);
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      emailConfirmated: true,
      codeToConfirmEmail: "",
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro", 400);
    }
    const consumerActually = await getRepository(Consumers).findOne(
      consumerID,
      { relations: ["address", "address.city", "address.city.state"] }
    );

    return consumerActually;
  }
}

export { CostumerVerifyEmailUseCase };
