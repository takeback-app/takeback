import axios from "axios";
import { InternalError } from "../../../config/GenerateErros";
import { cityRepository } from "../../../database/repositories/cityRepository";
import { consumerAddressRepository } from "../../../database/repositories/consumerAddressRepository";
import { consumerRepository } from "../../../database/repositories/consumerRepository";
import { stateRepository } from "../../../database/repositories/stateRepository";
import { zipCodeRepository } from "../../../database/repositories/zipCodeRepository";
import { apiCorreiosResponseType } from "../../../types/ApiCorreiosResponse";

interface UpdateDataProps {
  consumerId: string;
  values: {
    fullName: string;
    cpf: string;
    birthDate: string;
    address: {
      street: string;
      district: string;
      number: string;
      city: string;
      zipCode: string;
      complement: string;
    };
  };
}

export class UpdateConsumerDataUseCase {
  async execute(props: UpdateDataProps) {
    await consumerRepository()
      .update(props.consumerId, {
        fullName: props.values.fullName,
        birthDate: props.values.birthDate,
      })
      .catch((err) => console.log(err));

    const consumerAddress = await consumerRepository().findOne({
      select: ["id", "address"],
      relations: ["address"],
      where: {
        id: props.consumerId,
      },
    });

    const {
      data: { bairro, localidade, logradouro, uf, ibge, complemento },
    }: apiCorreiosResponseType = await axios.get(
      `https://viacep.com.br/ws/${props.values.address.zipCode}/json/`
    );

    if (!uf) {
      throw new InternalError("Cep não localizado", 404);
    }

    const city = await cityRepository().findOne({
      where: {
        ibgeCode: ibge,
      },
      relations: ["zipCode"],
    });

    const state = await stateRepository().findOne({
      where: {
        initials: uf,
      },
    });

    if (!city) {
      var newCity = await cityRepository().save({
        name: localidade,
        ibgeCode: ibge,
        state,
      });

      await zipCodeRepository().save({
        zipCode: props.values.address.zipCode,
        cities: newCity,
      });

      if (!newCity) {
        throw new InternalError(
          "Houve um erro ao realizar o cadastro da cidade",
          400
        );
      }
    } else {
      const zipCodes = await zipCodeRepository().find({
        where: {
          cities: city,
        },
      });

      const finded = zipCodes.find(
        (item) => item.zipCode === props.values.address.zipCode
      );

      if (!finded) {
        await zipCodeRepository().save({
          zipCode: props.values.address.zipCode,
          cities: city,
        });
      }
    }

    await consumerAddressRepository()
      .update(consumerAddress.address.id, {
        city: city || newCity,
        street: props.values.address.street || logradouro,
        district: props.values.address.district || bairro,
        number: props.values.address.number,
        zipCode: props.values.address.zipCode,
        complement: props.values.address.complement || complemento,
      })
      .catch((err) => console.log(err));

    const consumerData = await consumerRepository().findOne({
      relations: ["address", "address.city"],
      where: {
        id: props.consumerId,
      },
    });

    return consumerData;
  }
}
