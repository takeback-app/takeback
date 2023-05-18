import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface CostumerProps {
  consumerID: string;
  password: string;
}

class DesactiveCostumerUseCase {
  async execute({ consumerID, password }: CostumerProps) {
    if (!password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const costumer = await getRepository(Consumers).findOne({
      select: ["password"],
    });

    const passwordMatch = await bcrypt.compare(password, costumer.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao desativar conta", 404);
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      deactivedAccount: true,
    });

    if (affected === 0) {
      throw new InternalError("Erro ao desativar conta", 404);
    }

    return { message: "Conta desativada" };
  }
}

export { DesactiveCostumerUseCase };
