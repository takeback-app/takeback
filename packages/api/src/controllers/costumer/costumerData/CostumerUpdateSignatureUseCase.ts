import bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";

interface ConsumerRequestToUpdateSignature {
  signature: string;
  newSignature: string;
  consumerID: string;
}

class CostumerUpdateSignatureUseCase {
  async execute({
    signature,
    newSignature,
    consumerID,
  }: ConsumerRequestToUpdateSignature) {
    if (
      !newSignature ||
      newSignature.length != 4 ||
      !signature ||
      signature.length != 4
    ) {
      throw new InternalError("Dados não informados", 400);
    }

    const consumerData = await getRepository(Consumers).findOne(consumerID, {
      select: ["signature"],
    });

    const signatureMatch = await bcrypt.compare(
      signature,
      consumerData.signature
    );

    if (!signatureMatch) {
      throw new InternalError("Senha incorreta", 401);
    }

    const newSignatureEncrypted = bcrypt.hashSync(newSignature, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      signature: newSignatureEncrypted,
      signatureRegistered: true,
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro", 400);
    }
    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

    return consumer;
  }
}

export { CostumerUpdateSignatureUseCase };
