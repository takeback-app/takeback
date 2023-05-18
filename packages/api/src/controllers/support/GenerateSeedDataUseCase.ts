import { getRepository } from "typeorm";
import hbs from "handlebars";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import transporter from "../../config/SMTP";
import { InternalError } from "../../config/GenerateErros";

import { State } from "../../database/models/State";
import { City } from "../../database/models/City";
import { TransactionStatus } from "../../database/models/TransactionStatus";
import { CompanyUserTypes } from "../../database/models/CompanyUserTypes";
import { CompanyStatus } from "../../database/models/CompanyStatus";
import { PaymentMethods } from "../../database/models/PaymentMethod";
import { TakeBackUserTypes } from "../../database/models/TakeBackUserTypes";
import { TakeBackUsers } from "../../database/models/TakeBackUsers";
import { PaymentPlans } from "../../database/models/PaymentPlans";
import { PaymentOrderStatus } from "../../database/models/PaymentOrderStatus";
import { PaymentOrderMethods } from "../../database/models/PaymentOrderMethods";
import { Settings } from "../../database/models/Settings";

import * as seedData from "./SeedData";
import { generateToken } from "../../config/JWT";
import { ZipCodes } from "../../database/models/ZipCodes";
interface Props {
  cpf: string;
  email: string;
  name: string;
}

class GenerateSeedDataUseCase {
  async execute({ cpf, email, name }: Props) {
    if (!cpf || !email || !name) {
      return new InternalError("Dados incompletos", 400);
    }

    const [, count] = await getRepository(State).findAndCount();

    if (count > 0) {
      return new InternalError("Operação já executada", 400);
    }

    // Gerando os Estados
    const generetadStatesData = await getRepository(State).save(
      seedData.StatesSeed
    );

    if (generetadStatesData.length === 0) {
      return new InternalError("Erro ao gerar os estados", 400);
    }

    // Gerando a Cidade de Porteirinha
    const minas = await getRepository(State).findOne({
      where: {
        initials: "MG",
      },
    });

    const generatedCitiesData = await getRepository(City).save({
      name: "Porteirinha",
      ibgeCode: "3152204",
      state: minas,
    });

    await getRepository(ZipCodes).save({
      zipCode: "39520000",
      cities: generatedCitiesData,
    });

    if (!generatedCitiesData) {
      return new InternalError("Erro ao gerar a cidade", 400);
    }

    // Gerando os Status das Transações
    const generatedTransactionStatus = await getRepository(
      TransactionStatus
    ).save(seedData.TransactionStatusSeed);

    if (generatedTransactionStatus.length === 0) {
      return new InternalError("Erro ao gerar os status de transações", 400);
    }

    // Gerando as Configurações
    const generateSettings = await getRepository(Settings).save(
      seedData.SettingsSeed
    );

    if (generateSettings.length === 0) {
      return new InternalError("Erro ao gerar as configurações", 400);
    }

    // Gerando formas de pagamento para ordens de pagamento
    const generatePaymentMethodForPaymentOrder = await getRepository(
      PaymentOrderMethods
    ).save(seedData.PaymentOrderMethodsSeed);

    if (generatePaymentMethodForPaymentOrder.length === 0) {
      return new InternalError(
        "Erro ao gerar formas de pagamento para ordens de pagamento",
        400
      );
    }

    // Gerando status das ordens de pagamento
    const generatePaymentOrderStatus = await getRepository(
      PaymentOrderStatus
    ).save(seedData.PaymentOrderStatusSeed);

    if (generatePaymentOrderStatus.length === 0) {
      return new InternalError(
        "Erro ao gerar os status das ordens de pagamento",
        400
      );
    }

    // Gerando os Tipos de Usuários
    const generatedUserTypes = await getRepository(CompanyUserTypes).save(
      seedData.CompanyUserTypesSeed
    );

    if (generatedUserTypes.length === 0) {
      return new InternalError("Erro ao gerar os tipos de usuários", 400);
    }

    // Gerando os Status das Empresas Parceiras
    const generatedCompanyStatus = await getRepository(CompanyStatus).save(
      seedData.CompanyStatusSeed
    );

    if (generatedCompanyStatus.length === 0) {
      return new InternalError("Erro ao gerar os status das empresas", 400);
    }

    // Gerando valor default para o Plano de Pagamento
    const generatePaymentPlan = await getRepository(PaymentPlans).save(
      seedData.PaymentPlanSeed
    );

    if (generatePaymentPlan.length === 0) {
      return new InternalError(
        "Erro ao gerar o plano padrão das empresas",
        400
      );
    }

    // Gerando o método de pagamneto Takeback
    const generatedPaymentMethod = await getRepository(PaymentMethods).save({
      description: "Takeback",
      isTakebackMethod: true,
    });

    if (!generatedPaymentMethod) {
      return new InternalError("Erro ao gerar método de pagamento", 400);
    }

    // Gerando o método de pagamento Troco
    const generateBackMethod = await getRepository(PaymentMethods).save({
      description: "Troco",
      isBackMethod: true,
    });

    if (!generateBackMethod) {
      return new InternalError("Erro ao gerar método de pagamento troco", 400);
    }

    // Gerando tipos de usuários take back
    const takeBackUserTypes = await getRepository(TakeBackUserTypes).save(
      seedData.tbUserTypes
    );

    if (!takeBackUserTypes) {
      return new InternalError(
        "Erro ao gerar tipo de usuário do take back",
        400
      );
    }

    const token = crypto.randomBytes(10).toString("hex");
    const date = new Date();
    const expirateDate = date.setDate(date.getDate() + 2);

    const takeBackUsers = await getRepository(TakeBackUsers).save({
      cpf,
      email,
      name,
      phone: "",
      userType: takeBackUserTypes[0],
      isActive: true,
      resetPasswordToken: token,
      resetPasswordTokenExpiresDate: new Date(expirateDate),
    });

    if (!takeBackUsers) {
      return new InternalError("Erro ao gerar usuário do take back", 400);
    }

    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const tokenToSend = generateToken(
      {
        userId: takeBackUsers.id,
        token,
      },
      process.env.JWT_PRIVATE_KEY,
      172800
    );

    const html = template({
      title: `Olá ${takeBackUsers.name}! Seu cadastro está quase pronto!`,
      sectionOne: `Clique no link abaixo para criar sua senha e ativar seu usuário. Ah, o link expira em 48 horas.`,
      linkLabel: "Cadastrar senha!",
      link: `${process.env.APP_MANAGER_URL}/resetar-senha?token=${tokenToSend}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: email,
      subject: "TakeBack | Usuário ROOT",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Dados semeados";
  }
}

export { GenerateSeedDataUseCase };
