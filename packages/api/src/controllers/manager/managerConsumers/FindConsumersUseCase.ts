import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Consumers } from "../../../database/models/Consumer";
import { ConsumerAddress } from "../../../database/models/ConsumerAddress";

interface Props {
  filters: {
    status?: string;
    city?: string;
    consumer?: string;
    limit?: string;
    offset?: string;
  };
}

class FindConsumersUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select([
        "consumer.id",
        "consumer.createdAt",
        "consumer.fullName",
        "consumer.balance",
        "consumer.blockedBalance",
        "consumer.deactivedAccount",
      ])
      .addSelect(["city.name"])
      .leftJoin(ConsumerAddress, "address", "address.id = consumer.address")
      .leftJoin(City, "city", "city.id = address.city")
      .limit(parseInt(filters.limit) || 60)
      .offset(parseInt(filters.offset) * parseInt(filters.limit) || 0)
      .orderBy("consumer.fullName", "ASC");

    if (filters.consumer) {
      query.where("consumer.fullName ILIKE :fullName", {
        fullName: `%${filters.consumer}%`,
      });

      query.orWhere("consumer.cpf ILIKE :cpf", {
        cpf: `%${filters.consumer}%`,
      });
    }

    if (filters.status) {
      query.andWhere("consumer.deactivedAccount = :status", {
        status: !(filters.status === "true"),
      });
    }

    if (filters.city) {
      query.andWhere("city.id = :cityId", { cityId: filters.city });
    }

    const consumers = await query.getRawMany();

    return consumers;
  }
}

export { FindConsumersUseCase };
