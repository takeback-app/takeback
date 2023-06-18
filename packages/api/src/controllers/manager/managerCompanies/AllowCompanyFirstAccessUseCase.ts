import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyUsers } from "../../../database/models/CompanyUsers";
import { CompanyUserTypes } from "../../../database/models/CompanyUserTypes";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { maskCNPJ } from "../../../utils/Masks";
import { generateToken } from "../../../config/JWT";
import { CPFValidate } from "../../../utils/CPFValidate";
import { prisma } from "../../../prisma";
import { Company } from "@prisma/client";
import { Notify } from "../../../notifications";
import { NewCompany } from "../../../notifications/NewCompany";

interface Props {
  companyId: string;
  useCustomName?: boolean;
  customName?: string;
  useCustomFee?: boolean;
  customFee?: number;
  cpf?: string;
}

class AllowCompanyFirstAccessUseCase {
  async execute(data: Props) {
    if (!data.cpf) {
      throw new InternalError("Informe o CPF", 400);
    }

    const company = await prisma.company.findUnique({
      where: { id: data.companyId },
      include: { companyAddress: { select: { cityId: true } } },
    });

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    if (data.useCustomName && data.customName.length < 4) {
      throw new InternalError("Nome de usuário inválido", 400);
    }

    if (data.useCustomFee && !data.customFee) {
      throw new InternalError("Informe a taxa", 400);
    }

    const managerUser = await getRepository(CompanyUsers).find({
      where: { companyId: company.id, isRootUser: true },
    });

    if (managerUser.length > 0) {
      throw new InternalError("Usuário administrativo já cadastrado", 400);
    }

    const companyUserTypes = await getRepository(CompanyUserTypes).findOne({
      where: { description: "Administrador" },
    });

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    if (!CPFValidate(data.cpf)) {
      throw new InternalError("CPF inválido", 401);
    }

    const newUser = await getRepository(CompanyUsers).save({
      name: data.useCustomName ? data.customName : "Administrativo",
      email: company.email,
      cpf: data.cpf,
      companyId: company.id,
      companyUserTypes,
      resetPasswordToken: token,
      resetPasswordTokenExpiresDate: new Date(expirateDate),
      isRootUser: true,
    });

    if (!newUser) {
      return new InternalError("Erro Inexperado", 400);
    }

    const status = await getRepository(CompanyStatus).findOne({
      where: { description: "Ativo" },
    });

    await getRepository(Companies).update(company.id, {
      status,
      customIndustryFee: data.useCustomFee ? data.customFee / 100 : 0,
      customIndustryFeeActive: data.useCustomFee,
      firstAccessAllowedAt: new Date(),
    });

    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const tokenToSend = generateToken(
      {
        userId: newUser.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const html = template({
      title: "TakeBack | Acesso ao sistema",
      sectionOne: `Olá ${
        data.useCustomName ? data.customName : ""
      }, tudo bem? Temos ótimas notícias para você, o cadastro da sua empresa no TakeBack foi aprovado!`,
      sectionTwo: `Para acessar o sistema, utilize o seu CNPJ.: ${maskCNPJ(
        company.registeredNumber
      )}, o seu nome de USUÁRIO.: ${
        data.customName || "Administrativo"
      } e a sua SENHA que você pode criar acessando o link abaixo.`,
      linkLabel: "Criar senha!",
      link: `${process.env.APP_COMPANY_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Nos vemos em breve! Atenciosamente, Equipe TakeBack!",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: company.email,
      subject: "TakeBack - Seu cadastro foi aprovado!",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    await this.sendNotification(company, company.companyAddress.cityId);

    return "Acesso liberado";
  }

  async sendNotification(company: Company, cityId: number) {
    const users = await prisma.consumer.findMany({
      where: { consumerAddress: { cityId } },
      select: { id: true, expoNotificationToken: true },
    });

    if (!users.length) return;

    Notify.sendMany(users, new NewCompany(company));
  }
}

export { AllowCompanyFirstAccessUseCase };
