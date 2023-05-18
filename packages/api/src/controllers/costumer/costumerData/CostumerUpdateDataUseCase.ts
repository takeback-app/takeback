import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface ConsumerRequestToUpdateData {
  fullName: string;
  consumerID: string;
}

class CostumerUpdateDataUseCase {
  async execute({ fullName, consumerID }: ConsumerRequestToUpdateData) {
    if (!fullName) {
      throw new InternalError("Dados incompletos", 400);
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      fullName,
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro", 417);
    }
    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

    return consumer;
  }
}

export { CostumerUpdateDataUseCase };
