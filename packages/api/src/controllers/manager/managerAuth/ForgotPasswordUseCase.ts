import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../database/models/TakeBackUsers";
import { generateToken } from "../../../config/JWT";

interface Props {
  cpf: string;
}

class ForgotPasswordUseCase {
  async execute({ cpf }: Props) {
    if (!cpf) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(TakeBackUsers).findOne({
      where: { cpf },
      select: [
        "id",
        "cpf",
        "name",
        "email",
        "resetPasswordToken",
        "resetPasswordTokenExpiresDate",
        "isActive",
      ],
    });

    if (!user || !user.isActive) {
      throw new InternalError("Falha ao recuperar senha", 400);
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const updatedUser = await getRepository(TakeBackUsers).update(user.id, {
      resetPasswordToken: token,
      resetPasswordTokenExpiresDate: new Date(expirateDate),
    });

    if (updatedUser.affected === 0) {
      throw new InternalError("Houve um erro inesperado", 400);
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
      title: `Olá ${user.name}! Vamos recuperar a sua senha?`,
      sectionOne: `Clique no link abaixo para alterar a sua senha. Caso você não tenha solicitado a recuperação da senha, por favor ignore esse e-mail. Ah, o link expira em 48 horas.`,
      linkLabel: "Alterar senha!",
      link: `${process.env.APP_MANAGER_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: user.email,
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
