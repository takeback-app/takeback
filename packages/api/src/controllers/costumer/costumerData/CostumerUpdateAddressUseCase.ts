import axios from "axios";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../database/models/City";
import { Consumers } from "../../../database/models/Consumer";
import { ConsumerAddress } from "../../../database/models/ConsumerAddress";
import { State } from "../../../database/models/State";
import { ZipCodes } from "../../../database/models/ZipCodes";
import { apiCorreiosResponseType } from "../../../types/ApiCorreiosResponse";

interface ConsumerRequestToUpdateAddress {
  street: string;
  district: string;
  number: string;
  zipCode: string;
  complement: string;
  consumerID: string;
}

class CostumerUpdateAddressUseCase {
  async execute({
    street,
    district,
    number,
    zipCode,
    complement,
    consumerID,
  }: ConsumerRequestToUpdateAddress) {
    if (!street || !district || !zipCode) {
      throw new InternalError("Dados não informados", 400);
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    const {
      data: { bairro, localidade, logradouro, uf, ibge, complemento },
    }: apiCorreiosResponseType = await axios.get(
      `https://viacep.com.br/ws/${zipCode}/json/`
    );

    if (!uf) {
      throw new InternalError("Cep não localizado", 404);
    }

    const city = await getRepository(City).findOne({
      where: {
        ibgeCode: ibge,
      },
      relations: ["zipCode"],
    });

    const state = await getRepository(State).findOne({
      where: {
        initials: uf,
      },
    });

    if (!city) {
      var newCity = await getRepository(City).save({
        name: localidade,
        ibgeCode: ibge,
        state,
      });

      await getRepository(ZipCodes).save({
        zipCode,
        cities: newCity,
      });

      if (!newCity) {
        throw new InternalError(
          "Houve um erro ao realizar o cadastro da cidade",
          400
        );
      }
    } else {
      const zipCodes = await getRepository(ZipCodes).find({
        where: { cities: city },
      });

      const finded = zipCodes.find((item) => item.zipCode === zipCode);

      if (!finded) {
        await getRepository(ZipCodes).save({
          zipCode,
          cities: city,
        });
      }
    }

    const { affected } = await getRepository(ConsumerAddress).update(
      consumer.address.id,
      {
        street: street || logradouro,
        district: district || bairro,
        number,
        complement: complement || complemento,
        city,
        zipCode,
      }
    );

    if (affected === 0) {
      throw new InternalError("Houve um erro", 400);
    }

    const costumer = await getRepository(Consumers).findOne(consumerID, {
      relations: [
        "address",
        "address.city",
        "address.city.zipCode",
        "address.city.state",
      ],
    });

    return costumer;
  }
}

export { CostumerUpdateAddressUseCase };
