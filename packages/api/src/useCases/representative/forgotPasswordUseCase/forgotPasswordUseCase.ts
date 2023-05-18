import path from "path";
import fs from "fs";
import hbs from "handlebars";
import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { generateJWTToken } from "../../../config/JWT";
import { representativeRepository } from "../../../database/repositories/representativeRepository";

interface ForgotPasswordUseCaseProps {
  cpf: string;
}

class ForgotPasswordUseCase {
  async execute({ cpf }: ForgotPasswordUseCaseProps) {
    if (!cpf) {
      throw new InternalError("Dados não informados", 400);
    }

    const representative = await representativeRepository().findOne({
      select: ["id", "cpf", "name", "email", "password", "isActive"],
      where: {
        cpf: cpf.replace(/[^\d]/g, ""),
      },
    });

    if (!representative) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (!representative.isActive) {
      throw new InternalError("Usuário não autorizado", 400);
    }

    if (!representative.email) {
      throw new InternalError("Usuário não possui email", 404);
    }

    const TIME_TO_EXPIRES = 60 * 15; // 15 minutes

    const token = generateJWTToken(
      {
        id: representative.id,
      },
      process.env.JWT_PRIVATE_KEY,
      TIME_TO_EXPIRES
    );

    const emailTemplate = fs.readFileSync(
      path.resolve("src/services/mail/mailTemplates/defaultMailTemplate.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: `Olá ${representative.name}! Vamos recuperar a sua senha?`,
      sectionOne: `Clique no link abaixo para alterar a sua senha. Caso você não tenha solicitado a recuperação da senha, por favor ignore esse e-mail. Ah, o link expira em 15 minutos.`,
      linkLabel: "Alterar senha!",
      link: `${process.env.APP_REPRESENTATIVE_URL}/resetar-senha?token=${token}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: representative.email,
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
