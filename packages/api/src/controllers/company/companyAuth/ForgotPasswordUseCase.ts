import { InternalError } from "../../../config/GenerateErros";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import hbs from "handlebars";
import { generateToken } from "../../../config/JWT";
import transporter from "../../../config/SMTP";
import { CPFValidate } from "../../../utils/CPFValidate";

import { prisma } from "../../../prisma";

interface Props {
  cpf: string;
}

class ForgotPasswordUseCase {
  async execute({ cpf }: Props) {
    if (!cpf) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(cpf.replace(/\D/g, ""))) {
      throw new InternalError("CPF inválido", 400);
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: { cpf: cpf.replace(/\D/g, "") },
      include: {
        company: true,
        companyUserType: true,
      },
    });

    const company = companyUser.company;

    if (!company) {
      throw new InternalError("Empresa não encontrada", 404);
    }

    if (!companyUser) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (!companyUser.isActive) {
      throw new InternalError("Usuário inativo", 404);
    }

    if (!companyUser.companyUserType.isManager) {
      throw new InternalError(
        "Por favor, solicite ao administrador da empresa que altere a sua senha",
        400
      );
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const updatedCompanyUser = await prisma.companyUser
      .update({
        where: { id: companyUser.id },
        data: {
          resetPasswordToken: token,
          resetPasswordTokenExpiresDate: new Date(expirateDate),
        },
      })
      .catch((_) => {
        throw new InternalError("Houve um erro inesperado", 400);
      });

    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const tokenToSend = generateToken(
      {
        userId: companyUser.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const html = template({
      title: `Olá ${companyUser.name}! Vamos recuperar a sua senha?`,
      sectionOne: `Clique no link abaixo para alterar a sua senha. Caso você não tenha solicitado a recuperação da senha, por favor ignore esse e-mail. Ah, o link expira em 48 horas.`,
      linkLabel: "Alterar senha!",
      link: `${process.env.APP_COMPANY_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: companyUser.email,
      subject: "TakeBack | Recuperação de senha",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Prontinho! Agora verifique a sua caixa de e-mail!";
  }
}

export { ForgotPasswordUseCase };
