import hbs from "handlebars";
import path from "path";
import fs from "fs";

import {
  AlreadyExistsError,
  GenericError,
  NotFoundError,
} from "../../../config/errors";
import { cityRepository } from "../../../database/repositories/cityRepository";
import { companyAddressRepository } from "../../../database/repositories/companyAddressRepository";
import { companyRepository } from "../../../database/repositories/companyRepository";
import { companyStatusRepository } from "../../../database/repositories/companyStatusRepository";
import { representativeRepository } from "../../../database/repositories/representativeRepository";
import { industryRepository } from "../../../database/repositories/industryRepository";
import { paymentPlanRepository } from "../../../database/repositories/paymentPlanRepository";
import { cnpjValidation } from "../../../utils/CNPJValidate";
import transporter from "../../../config/SMTP";

type RegisterCompanyUseCaseProps = {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  industryId: number;
  paymentPlanId: number;
  cityId: number;
  complement: string;
  district: string;
  number: string;
  street: string;
  zipCode: string;
  representativeId: string;
};

class RegisterCompanyUseCase {
  async execute({ ...data }: RegisterCompanyUseCaseProps) {
    if (
      !data.industryId ||
      !data.corporateName ||
      !data.email ||
      !data.fantasyName ||
      !data.phone ||
      !data.registeredNumber ||
      !data.cityId ||
      !data.zipCode ||
      !data.representativeId
    ) {
      throw new GenericError("Dados incompletos", 400);
    }

    if (!cnpjValidation(data.registeredNumber.replace(/\D/g, ""))) {
      throw new GenericError("CNPJ inválido", 400);
    }

    const companyAlreadyExists = await companyRepository()
      .findOne({
        where: {
          registeredNumber: data.registeredNumber.replace(/\D/g, ""),
        },
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (companyAlreadyExists) {
      throw new AlreadyExistsError("Empresa já cadastrada");
    }

    const defaultStatus = await companyStatusRepository()
      .findOne({
        where: {
          description: "Cadastro solicitado",
        },
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (!defaultStatus) {
      throw new NotFoundError("Status não encontrado");
    }

    const paymentPlan = await paymentPlanRepository()
      .findOne({
        where: {
          id: 1,
        },
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (!paymentPlan) {
      throw new NotFoundError("Plano não encontrado");
    }

    const industry = await industryRepository()
      .findOne({
        where: {
          id: data.industryId,
        },
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (!industry) {
      throw new NotFoundError("Ramo de atividade não encontrado");
    }

    const city = await cityRepository()
      .findOne({
        where: {
          id: data.cityId,
        },
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (!city) {
      throw new NotFoundError("Cidade não encontrada");
    }

    const representative = await representativeRepository().findOne({
      where: {
        id: data.representativeId,
      },
    });

    const newCompanyAddress = await companyAddressRepository().save({
      city,
      complement: data.complement.toLowerCase(),
      district: data.district.toLowerCase(),
      number: data.number,
      street: data.street.toLowerCase(),
      zipCode: data.zipCode.replace(/\D/g, ""),
    });

    if (!newCompanyAddress) {
      throw new GenericError("Erro ao cadastrar endereço", 400);
    }

    const newCompany = await companyRepository()
      .save({
        fantasyName: data.fantasyName.toLowerCase(),
        corporateName: data.corporateName.toLowerCase(),
        registeredNumber: data.registeredNumber.replace(/\D/g, ""),
        email: data.email.toLowerCase(),
        phone: data.phone.replace(/\D/g, ""),
        address: newCompanyAddress,
        industry: industry,
        status: defaultStatus,
        paymentPlan,
        representative,
      })
      .catch((err) => {
        throw new GenericError(err.message, 400);
      });

    if (!newCompany) {
      throw new GenericError("Houve um erro", 400);
    }

    const emailTemplate = fs.readFileSync(
      path.resolve("src/services/mail/mailTemplates/defaultMailTemplate.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: "Obrigado pelo interesse em fazer parte da TakeBack!",
      sectionOne: `A solicitação de cadastro da empresa ${newCompany.fantasyName} foi recebida com sucesso! Estamos trabalhando na validação dos dados da empresa, assim que tivermos alguma novidade te atualizaremos por aqui.`,
      sectionTwo:
        "Qualquer dúvida basta entrar em contato conosco pelo Email.: contato@takeback.app.br ou pelo nosso WhatsApp.: (38) 9 9833-0021.",
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

    return "Solicitação de cadastro recebida";
  }
}

export { RegisterCompanyUseCase };
