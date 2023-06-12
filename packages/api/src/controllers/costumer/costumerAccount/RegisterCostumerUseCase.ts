import { Sex } from "@prisma/client";
import axios from "axios";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../database/models/City";
import { ConsumerAddress } from "../../../database/models/ConsumerAddress";
import { State } from "../../../database/models/State";
import { ZipCodes } from "../../../database/models/ZipCodes";
import { prisma } from "../../../prisma";
import { apiCorreiosResponseType } from "../../../types/ApiCorreiosResponse";
import { GenerateNewUserBonus } from "../../../useCases/consumer/bonus/GenerateNewUserBonus";
import { CPFValidate } from "../../../utils/CPFValidate";

interface userDataProps {
  fullName: string;
  cpf: string;
  email: string;
  zipCode: string;
  password: string;
  sex: string;
  birthDate: string;
  phone?: string;
}

class RegisterCostumerUseCase {
  async execute({
    fullName,
    cpf,
    email,
    zipCode,
    birthDate,
    sex,
    password,
    phone,
  }: userDataProps) {
    if (!fullName || !cpf || !zipCode || !email || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF inválido", 400);
    }

    const client = await prisma.consumer.findFirst({
      where: { cpf },
    });

    if (!!client && !client.isPlaceholderConsumer) {
      throw new InternalError("CPF já cadastrado", 302);
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

    const newAddress = await getRepository(ConsumerAddress).save({
      city: city || newCity,
      street: logradouro,
      district: bairro,
      complement: complemento,
      zipCode,
    });

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const consumerData = {
      fullName,
      cpf,
      phone: phone ? phone.replace(/\D/g, "") : "",
      email,
      sex: sex as Sex,
      birthDate: birthDate
        ? DateTime.fromFormat(birthDate, "dd/MM/yyyy")
            .plus({ hours: 3 })
            .toJSDate()
        : undefined,
      addressId: newAddress.id,
      password: passwordEncrypted,
      isPlaceholderConsumer: false,
    };

    const newClient = await prisma.consumer.upsert({
      where: { cpf },
      update: consumerData,
      create: consumerData,
    });

    if (client) {
      const newUserBonus = new GenerateNewUserBonus();

      const transaction = await prisma.transaction.findFirst({
        where: { consumersId: client.id },
        select: { id: true },
        orderBy: { createdAt: "asc" },
      });

      await newUserBonus.create(transaction.id);
    }

    return newClient;
  }
}

export { RegisterCostumerUseCase };
