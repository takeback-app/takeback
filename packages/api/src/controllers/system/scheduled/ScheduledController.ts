import { Request, Response } from "express";
import hbs from "handlebars";
import path from "path";
import fs from "fs";

import transporter from "../../../config/SMTP";
import { format } from "../../../utils/DateFormat";

import { VerifyCashbacksExpired } from "../../manager/managerCompanies/VerifyCashbacksExpired";
import { VerifyProvisionalAccessUseCase } from "../../manager/managerCompanies/VerifyProvisionalAccessUseCase";
import { FindSupportsUseCase } from "../../support/FindSupportsUseCase";
import { CompaniesMonthliesVerifyUseCase } from "./CompaniesMonthliesVerifyUseCase";

class ScheduledController {
  async runChecks(request: Request, response: Response) {
    var mailList = [];

    const verifyMonthlies = new CompaniesMonthliesVerifyUseCase();
    const verifyCashbacks = new VerifyCashbacksExpired();
    const verifyProvisional = new VerifyProvisionalAccessUseCase();
    const findSupports = new FindSupportsUseCase();

    const cashbacksResult = await verifyCashbacks.execute();
    const monthlyResult = await verifyMonthlies.execute();
    const provisionalResult = await verifyProvisional.execute();
    const supports = await findSupports.execute();

    supports.map((item) => {
      mailList.push(item.mail);
    });

    // CONFIGURAÇÃO ENVIO DE EMAIL COM TEMPLATE
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: "Takeback Dev Controll",
      sectionOne: `MENSALIDADES: ${monthlyResult} | CASHBACKS: ${cashbacksResult}`,
      sectionTwo: `ACESSO PROVISÓRIO: ${provisionalResult}`,
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: mailList.toString(),
      subject: `Takeback Dev Controll - ${format(new Date())}`,
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return response.status(200).json({ message: "Checks executed!" });
  }
}

export { ScheduledController };
