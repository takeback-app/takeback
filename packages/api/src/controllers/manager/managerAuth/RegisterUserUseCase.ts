import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import transporter from "../../../config/SMTP";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../database/models/TakeBackUsers";
import { TakeBackUserTypes } from "../../../database/models/TakeBackUserTypes";
import { generateToken } from "../../../config/JWT";
import { CPFValidate } from "../../../utils/CPFValidate";

interface DataProps {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  userTypeId: string;
}

interface Props {
  data: DataProps;
  userId: string;
}

class RegisterUserUseCase {
  async execute({ data, userId }: Props) {
    if (
      !data.name ||
      !data.cpf ||
      !data.email ||
      !data.phone ||
      !data.userTypeId
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      relations: ["userType"],
    });

    if (user.userType.id !== 1 && user.userType.id !== 2) {
      throw new InternalError("Não autorizado", 401);
    }

    const takeBackUser = await getRepository(TakeBackUsers).findOne({
      where: { cpf: data.cpf },
    });

    if (takeBackUser) {
      throw new InternalError("CPF já cadastrado", 302);
    }

    const userType = await getRepository(TakeBackUserTypes).findOne(
      parseInt(data.userTypeId)
    );

    if (!userType) {
      throw new InternalError("Tipo de usuário inexistente", 401);
    }

    if (!CPFValidate(data.cpf.replace(/[^\d]/g, ""))) {
      throw new InternalError("Cpf inválido", 400);
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const userRegistered = await getRepository(TakeBackUsers).save({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      userType: userType,
      isActive: true,
      phone: data.phone,
      resetPasswordToken: token,
      resetPasswordTokenExpiresDate: new Date(expirateDate),
    });

    if (!userRegistered) {
      throw new InternalError("Houve um erro inesperado", 400);
    }

    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const tokenToSend = generateToken(
      {
        userId: userRegistered.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const html = template({
      title: `Olá ${userRegistered.name}! Seu cadastro está quase pronto!`,
      sectionOne: `Clique no link abaixo para criar sua senha e ativar seu usuário. Ah, o link expira em 48 horas.`,
      linkLabel: "Cadastrar senha!",
      link: `${process.env.APP_MANAGER_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: userRegistered.email,
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

    return "Usuário cadastrado com sucesso!";
  }
}

export { RegisterUserUseCase };
