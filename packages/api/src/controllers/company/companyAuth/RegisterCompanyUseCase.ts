import { getRepository } from "typeorm";
import axios from "axios";
import hbs from "handlebars";
import path from "path";
import fs from "fs";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../database/models/Industry";
import { City } from "../../../database/models/City";
import { Companies } from "../../../database/models/Company";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { State } from "../../../database/models/State";
import { apiCorreiosResponseType } from "../../../types/ApiCorreiosResponse";

import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { PaymentPlans } from "../../../database/models/PaymentPlans";
import { ZipCodes } from "../../../database/models/ZipCodes";

interface Props {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  industry: string;
  zipCode: string;
}

class RegisterCompanyUseCase {
  async execute({
    industry,
    corporateName,
    email,
    fantasyName,
    phone,
    registeredNumber,
    zipCode,
  }: Props) {
    if (
      !industry ||
      !corporateName ||
      !email ||
      !fantasyName ||
      !phone ||
      !registeredNumber ||
      !zipCode
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await getRepository(Companies).findOne({
      where: {
        registeredNumber,
      },
    });

    if (company) {
      throw new InternalError("CNPJ já cadastrado", 302);
    }

    const localizedIndustry = await getRepository(Industries).findOne(industry);

    if (!localizedIndustry) {
      throw new InternalError("Ramo de atividade não encontrado", 404);
    }

    const companyStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Cadastro solicitado" },
    });

    const paymentPlan = await getRepository(PaymentPlans).findOne({
      where: { id: 1 },
    });

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

    const newAddress = await getRepository(CompaniesAddress).save({
      city: city || newCity,
      street: logradouro,
      district: bairro,
      complement: complemento,
      zipCode,
    });

    const newCompany = await getRepository(Companies).save({
      corporateName,
      fantasyName,
      registeredNumber,
      email,
      phone,
      address: newAddress,
      industry: localizedIndustry,
      status: companyStatus,
      paymentPlan,
    });

    if (!newCompany) {
      throw new InternalError("Houve um erro", 500);
    }

    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: "Obrigado pelo interesse em fazer parte da TakeBack!",
      sectionOne: `A solicitação de cadastro da empresa ${newCompany.fantasyName} foi recebida com sucesso! Estamos trabalhando na validação dos dados da empresa, assim que tivermos alguma novidade te atualizaremos por aqui.`,
      sectionTwo:
        "Qualquer dúvida basta entrar em contato conosco pelo Email.: contato@takeback.app.br  ou pelo nosso  WhatsApp.: (38) 9833-0021.",
      sectionThree: "Nos vemos em breve :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: newCompany.email,
      subject: "TakeBack - Solicitação de cadastro",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Solicitação recebida";
  }
}

export { RegisterCompanyUseCase };
