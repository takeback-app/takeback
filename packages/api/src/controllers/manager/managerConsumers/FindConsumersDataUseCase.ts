import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Consumers } from "../../../database/models/Consumer";
import { ConsumerAddress } from "../../../database/models/ConsumerAddress";

interface Props {
  consumerId: string;
}

class FindConsumersDataUseCase {
  async execute({ consumerId }: Props) {
    const consumersData = await getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select([
        "consumer.id",
        "consumer.fullName",
        "consumer.createdAt",
        "consumer.phone",
        "consumer.email",
        "consumer.cpf",
        "consumer.signatureRegistered",
        "consumer.balance",
        "consumer.blockedBalance",
        "consumer.emailConfirmated",
        "consumer.deactivedAccount",
      ])
      .addSelect([
        "address.street",
        "address.district",
        "address.number",
        "address.complement",
        "address.zipCode",
        "city.name",
        "city.state",
      ])
      .leftJoin(ConsumerAddress, "address", "address.id = consumer.address")
      .leftJoin(City, "city", "city.id = address.city")
      .where("consumer.id = :consumerId", {
        consumerId,
      })
      .getRawOne();

    return consumersData;
  }
}

export { FindConsumersDataUseCase };
