import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface ConsumerRequestToUpdatePassword {
  password: string;
  newPassword: string;
  consumerID: string;
}

class UpdateCostumerPasswordUseCase {
  async execute({ password, newPassword, consumerID }) {
    if (!password || !newPassword) {
      throw new InternalError("Dados não informados", 400);
    }

    const consumerData = await getRepository(Consumers).findOne(consumerID, {
      select: ["password"],
    });

    const passwordMatch = await bcrypt.compare(password, consumerData.password);

    if (!passwordMatch) {
      throw new InternalError("Senha incorreta", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      password: newPasswordEncrypted,
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro", 400);
    }
    return { message: "Senha alterada" };
  }
}

export { UpdateCostumerPasswordUseCase };
