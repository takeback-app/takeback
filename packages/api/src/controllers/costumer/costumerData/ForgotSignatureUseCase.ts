import crypto from "crypto";
import path from "path";
import fs from "fs";
import hbs from "handlebars";
import transporter from "../../../config/SMTP";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";
import { CPFValidate } from "../../../utils/CPFValidate";
import { generateToken } from "../../../config/JWT";

interface ForgotSignatureProps {
  cpf: string;
}

class ForgotSignatureUseCase {
  async execute({ cpf }: ForgotSignatureProps) {
    if (!cpf) {
      throw new InternalError("Dados não informados", 400);
    }

    if (!CPFValidate(cpf)) {
      throw new InternalError("CPF inválido", 400);
    }

    const consumer = await getRepository(Consumers).findOne({
      where: { cpf },
    });

    if (consumer.deactivedAccount) {
      throw new InternalError("Conta inativa", 400);
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const updatedConsumer = await getRepository(Consumers).update(consumer.id, {
      resetPasswordToken: token,
      resetPasswordTokenExpiresDate: new Date(expirateDate),
    });

    if (updatedConsumer.affected === 0) {
      throw new InternalError("Houve um erro inesperado", 400);
    }

    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const tokenToSend = generateToken(
      {
        userId: consumer.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const html = template({
      title: `Olá ${consumer.fullName}! Vamos recuperar a sua assinatura?`,
      sectionOne: `Clique no link abaixo para alterar a sua assinatura. Caso você não tenha solicitado a recuperação da sua assinatura, por favor ignore esse e-mail. Ah, o link expira em 48 horas.`,
      linkLabel: "Alterar assinatura!",
      link: `${process.env.APP_SUPPORT_URL}/user/reset-signature/${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: consumer.email,
      subject: "TakeBack | Recuperação de assinatura",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return { message: "Prontinho! Agora verifique a sua caixa de e-mail!" };
  }
}

export { ForgotSignatureUseCase };
