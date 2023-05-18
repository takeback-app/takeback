import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { Representative } from "../../../database/models/Representative";
import { CPFValidate } from "../../../utils/CPFValidate";
import { generateToken } from "../../../config/JWT";

interface RegisterUseCaseProps {
  name: string;
  cpf: string;
  phone?: string;
  email: string;
  whatsapp?: string;
  gainPercentage: number;
}

class RegisterUseCase {
  async execute(props: RegisterUseCaseProps) {
    if (!props.name || !props.cpf || !props.gainPercentage || !props.email) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (!CPFValidate(props.cpf.replace(/[^\d]/g, ""))) {
      throw new InternalError("CPF inválido", 400);
    }

    const representative = await getRepository(Representative).findOne({
      where: { cpf: props.cpf.replace(/\D/g, "") },
    });

    if (representative) {
      throw new InternalError("Representante já cadastrado", 400);
    }

    await getRepository(Representative)
      .save({
        name: props.name.toLowerCase(),
        cpf: props.cpf.replace(/\D/g, ""),
        email: props.email.toLowerCase(),
        phone: props.phone || "",
        whatsapp: props.whatsapp || "",
        gainPercentage: props.gainPercentage,
        isActive: true,
      })
      .then((user) => {
        const expiresIn = 60 * 60 * 24 * 2; // Dois dias
        const token = crypto.randomBytes(10).toString("hex");

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
          expiresIn
        );

        const html = template({
          title: `Olá ${user.name}! Seu cadastro está quase pronto!`,
          sectionOne: `Clique no link abaixo para criar sua senha e ativar seu usuário. Ah, o link expira em 48 horas.`,
          linkLabel: "Cadastrar senha!",
          link: `${process.env.APP_REPRESENTATIVE_URL}/resetar-senha?token=${tokenToSend}`,
          sectionThree: "Abraços! Equipe TakeBack :)",
        });

        var mailOptions = {
          from: process.env.MAIL_CONFIG_USER,
          to: user.email,
          subject: "TakeBack - Acesso ao sistema",
          html,
        };

        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            return "Houve um erro ao enviar o email.";
          } else {
            return "Email enviado.";
          }
        });
      })
      .catch((err) => {
        if (err) {
          throw new InternalError(err.message, 400);
        }
      });

    return `Representante ${props.name} cadastrado com sucesso!`;
  }
}

export { RegisterUseCase };
