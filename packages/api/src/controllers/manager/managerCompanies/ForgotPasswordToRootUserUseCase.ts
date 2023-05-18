import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyUsers } from "../../../database/models/CompanyUsers";
import { maskCNPJ } from "../../../utils/Masks";
import { generateToken } from "../../../config/JWT";

interface Props {
  companyId: string;
  userName: string;
  email: string;
}

class ForgotPasswordToRootUserUseCase {
  async execute({ companyId, email, userName }: Props) {
    if (!companyId || !email || !userName) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { company, isRootUser: true },
    });

    if (!companyUser) {
      throw new InternalError("Usuário principal não localizado", 404);
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const updatedUser = await getRepository(CompanyUsers).update(
      companyUser.id,
      {
        name: userName,
        isActive: true,
        resetPasswordToken: token,
        resetPasswordTokenExpiresDate: new Date(expirateDate),
      }
    );

    if (updatedUser.affected === 0) {
      throw new InternalError("Erro ao recuperar a senha do usuário", 400);
    }

    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const tokenToSend = generateToken(
      {
        userId: companyUser.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: `Olá ${companyUser.name}! Vamos recuperar a sua senha?`,
      sectionOne: `Clique no link abaixo para alterar a sua senha. Caso você não tenha solicitado a recuperação da senha, por favor ignore esse e-mail. Ah, o link expira em 48 horas.`,
      linkLabel: "Alterar senha!",
      link: `${process.env.APP_COMPANY_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: email,
      subject: "TakeBack - Recuperação de senha",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Email de recuperação de senha enviado";
  }
}

export { ForgotPasswordToRootUserUseCase };
