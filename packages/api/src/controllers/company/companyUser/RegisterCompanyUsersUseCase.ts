import { InternalError } from "../../../config/GenerateErros";
import bcrypt from "bcrypt";
import hbs from "handlebars";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import transporter from "../../../config/SMTP";
import { generateToken } from "../../../config/JWT";
import { CPFValidate } from "../../../utils/CPFValidate";
import { ValidateUserPasswordUseCase } from "../companyCashback/ValidateUserPasswordUseCase";
import { prisma } from "../../../prisma";

interface Props {
  companyId: string;
  userTypeId: number;
  name: string;
  cpf?: string;
  email?: string;
  password?: string;
}

class RegisterCompanyUsersUseCase {
  async execute({ companyId, userTypeId, name, password, email, cpf }: Props) {
    const company = await prisma.company.findFirst({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Dados inválidos", 400);
    }

    const userExistsInThisCompany = await prisma.companyUser.findFirst({
      where: {
        OR: [{ name }, { cpf: cpf.replace(/\D/g, "") }],
        AND: [{ company: { id: companyId } }],
      },
    });

    if (userExistsInThisCompany) {
      throw new InternalError("Nome de usuário ou CPF já em uso", 400);
    }

    const companyUserType = await prisma.companyUserType.findFirst({
      where: { id: userTypeId },
    });

    if (companyUserType.isManager) {
      if (!email || !cpf) {
        throw new InternalError("Dados incompletos", 400);
      }

      if (!CPFValidate(cpf.replace(/\D/g, ""))) {
        throw new InternalError("CPF Inválido", 400);
      }
    }

    if (!companyUserType.isManager) {
      if (!password || password.length < 4) {
        throw new InternalError("Senha inválida", 400);
      }

      await this.validateUniqueUserPassword(companyId, password);

      const passwordEncrypted = bcrypt.hashSync(password, 10);

      const user = await prisma.companyUser.upsert({
        where: { cpf: cpf.replace(/\D/g, "") },
        update: {
          companyId,
          companyUserTypesId: userTypeId,
          name,
          email,
          cpf,
          password: passwordEncrypted,
          isActive: true,
        },
        create: {
          companyId,
          companyUserTypesId: userTypeId,
          name,
          email,
          cpf,
          password: passwordEncrypted,
          isActive: true,
        },
      });

      if (!user) {
        throw new InternalError("Houve um erro na criação do usuário", 400);
      }

      return `Usuário ${name} cadastrado com sucesso`;
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const user = await prisma.companyUser.upsert({
      where: { cpf: cpf.replace(/\D/g, "") },
      update: {
        company: { connect: { id: companyId } },
        companyUserType: { connect: { id: userTypeId } },
        name,
        email,
        cpf,
        isActive: true,
        resetPasswordToken: token,
        resetPasswordTokenExpiresDate: new Date(expirateDate),
      },
      create: {
        company: { connect: { id: companyId } },
        companyUserType: { connect: { id: userTypeId } },
        name,
        email,
        cpf,
        isActive: true,
        resetPasswordToken: token,
        resetPasswordTokenExpiresDate: new Date(expirateDate),
      },
    });

    if (!user) {
      throw new InternalError("Houve um erro na criação do usuário", 400);
    }

    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const tokenToSend = generateToken(
      {
        userId: user.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const html = template({
      title: `Olá ${name}! Seu cadastro está quase pronto!`,
      sectionOne: `Clique no link abaixo para criar sua senha e ativar seu usuário. Ah, o link expira em 48 horas.`,
      linkLabel: "Cadastrar senha!",
      link: `${process.env.APP_COMPANY_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: email,
      subject: "TakeBack | Cadastro de usuário",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return `Usuário ${name} cadastrado com sucesso`;
  }

  async validateUniqueUserPassword(companyId: string, password: string) {
    const useCase = new ValidateUserPasswordUseCase();

    const user = await useCase.findCompanyUserByPassword(companyId, password);

    if (user) {
      throw new InternalError("Sequência não permitida. Use outra.", 400);
    }
  }
}

export { RegisterCompanyUsersUseCase };
