import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../database/models/Consumer";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";

interface MailToVerifyProps {
  consumerID: string;
}

class CostumerSendMailToVerifyUseCase {
  async execute({ consumerID }: MailToVerifyProps) {
    const consumer = await getRepository(Consumers).findOne(consumerID);

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    const newCode = generateRandomNumber(1000, 9999);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      codeToConfirmEmail: JSON.stringify(newCode),
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro, tente novamente", 400);
    }

    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: "Confirmação de email",
      sectionOne: `Olá ${consumer.fullName}, seu código de verificação é ${newCode}`,
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: consumer.email,
      subject: "TakeBack - Confirmação de email",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Email enviado!";
  }
}

export { CostumerSendMailToVerifyUseCase };
