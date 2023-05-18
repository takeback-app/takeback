import { getRepository, ILike, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { PaymentOrderMethods } from "../../../database/models/PaymentOrderMethods";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { maskCurrency } from "../../../utils/Masks";
import transporter from "../../../config/SMTP";
import path from "path";
import fs from "fs";
import hbs from "handlebars";
import { Settings } from "../../../database/models/Settings";

interface Props {
  transactionIDs: number[];
  companyId: string;
  paymentMethodId: number;
}

class GeneratePaymentOrderUseCase {
  async execute({ transactionIDs, companyId, paymentMethodId }: Props) {
    if (!paymentMethodId || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa inexistente", 404);
    }

    const processStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Em processamento" },
    });

    // Buscando transações da ordem de pagamento
    const transactionsLocalized = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.transactionStatus",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
        "transaction.backAmount",
      ])
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("transaction.id IN (:...transactionIDs)", {
        transactionIDs,
      })
      .getRawMany();

    // Variáveis para receber os valores da taxa takeback, cashback e do troco
    let takebackFeeAmount = 0;
    let cashbackAmount = 0;
    let backAmount = 0;

    // Pegando os IDs das transações da ordem de pagamento
    const transactionsInProcess = [];
    transactionsLocalized.map((item) => {
      if (item.transactionStatusId === processStatus.id) {
        transactionsInProcess.push(item.transaction_id);
      }

      // Inserindo valor da taxa takeback na transação
      takebackFeeAmount =
        takebackFeeAmount + parseFloat(item.transaction_takebackFeeAmount);

      // Inserindo valor do cashback na transação
      cashbackAmount =
        cashbackAmount + parseFloat(item.transaction_cashbackAmount);

      // Inserindo o valor do troco na transação
      backAmount = backAmount + parseFloat(item.transaction_backAmount);
    });

    // Verificando se algum transação selecionada
    // para uma ordem de pagamento já está
    // em outra ordem de pagamento
    if (transactionsInProcess.length !== 0) {
      return {
        message: "Há cashbacks em processamento",
        cashbacks: transactionsInProcess,
      };
    }

    const awaitingStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: ILike("aguardando confirmacao") },
    });

    // Buscando a ordem de pagamento pelo ID
    const paymentMethod = await getRepository(PaymentOrderMethods).findOne({
      where: { id: paymentMethodId },
    });

    // Criando a ordem de pagamento
    const paymentOrder = await getRepository(PaymentOrder).save({
      value: takebackFeeAmount + cashbackAmount + backAmount,
      company,
      status: awaitingStatus,
      paymentMethod,
    });

    // Atualizando as transações
    transactionsLocalized.map(async (item) => {
      await getRepository(Transactions).update(item.transaction_id, {
        paymentOrder,
        transactionStatus: processStatus,
      });
    });

    const settings = await getRepository(Settings).findOne({
      select: ["takebackPixKey"],
      where: { id: 1 },
    });

    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: `Solicitação de Pagamento`,
      sectionOne: `Recebemos a sua solicitação de pagamento referente à ordem N°${
        paymentOrder.id
      } no valor de ${maskCurrency((paymentOrder.value * 10000).toString())}`,
      sectionTwo: `Estamos processando o seu pagamento, caso ainda não tenha o efetuado segue a nossa chave PIX: ${settings.takebackPixKey}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: company.email,
      subject: "TakeBack | Pagamento de Cashbacks",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Estamos processando o pagamento, isso pode levar algumas horas.";
  }
}

export { GeneratePaymentOrderUseCase };
