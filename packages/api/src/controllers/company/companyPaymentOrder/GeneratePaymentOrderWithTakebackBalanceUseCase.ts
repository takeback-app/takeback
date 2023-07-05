import fs from "fs";
import hbs from "handlebars";
import path from "path";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import transporter from "../../../config/SMTP";
import { Companies } from "../../../database/models/Company";
import { Consumers } from "../../../database/models/Consumer";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderMethods } from "../../../database/models/PaymentOrderMethods";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { ApproveTransactionUseCase } from "../../../useCases/cashback/ApproveTransactionUseCase";
import { applyCurrencyMask } from "../../../utils/Masks";
import { UpdateCompanyStatusByTransactionsUseCase } from "../companyCashback/UpdateCompanyStatusByTransactionsUseCase";

interface Props {
  transactionIDs: number[];
  companyId: string;
  paymentMethodId: number;
}

class GeneratePaymentOrderWithTakebackBalanceUseCase {
  async execute({ companyId, paymentMethodId, transactionIDs }: Props) {
    if (!paymentMethodId || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa inexistente", 404);
    }

    const approvedStatusTransaction = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Aprovada" },
    });

    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.transactionStatus",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
        "transaction.backAmount",
        "transaction.totalAmount",
      ])
      .addSelect(["consumer.id"])
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .where("transaction.id IN (:...transactionIDs)", {
        transactionIDs,
      })
      .getRawMany();

    // Agrupando as transações por usuário
    const transactionsReduced = transactions.reduce(
      (previousValue, currentValue) => {
        previousValue[currentValue.consumer_id] =
          previousValue[currentValue.consumer_id] || [];
        previousValue[currentValue.consumer_id].push(currentValue);
        return previousValue;
      },
      Object.create(null)
    );

    // Alterando o formato do agrupamento para um formato compatível para mapeamento
    const transactionGroupedPerConsumer = [];
    for (const [key, values] of Object.entries(transactionsReduced)) {
      transactionGroupedPerConsumer.push({
        consumerId: key,
        transactions: values,
      });
    }

    const consumerToChangeBalance = [];
    // Somando os valores das transações e agrupando por usuário
    transactionGroupedPerConsumer.map((item) => {
      let value = 0;
      item.transactions.map((transaction) => {
        value =
          value +
          parseFloat(transaction.transaction_cashbackAmount) +
          parseFloat(transaction.transaction_backAmount);
      });

      consumerToChangeBalance.push({
        consumerId: item.consumerId,
        value: value,
      });
    });

    // Variáveis para receber os valors da taxa takeback, cashback e do troco
    let takebackFeeAmount = 0;
    let cashbackAmount = 0;
    let backAmount = 0;

    // Pegando os IDs das transações da ordem de pagamento
    const transactionsInProcess = [];
    transactions.map(async (item) => {
      if (item.transactionStatusId === approvedStatusTransaction.id) {
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

    // Verificando se alguma transação selecionada
    // para uma ordem de pagamento já está
    // em outra ordem de pagamento
    if (transactionsInProcess.length !== 0) {
      return {
        message: "Há cashbacks em processamento",
        cashbacks: transactionsInProcess,
      };
    }

    const approvedStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    // Buscando a ordem de pagamento pelo ID
    const paymentMethod = await getRepository(PaymentOrderMethods).findOne(1);

    if (
      company.positiveBalance <
      takebackFeeAmount + cashbackAmount + backAmount
    ) {
      throw new InternalError("Saldo Takeback insuficiente", 400);
    }

    // Atualizando a ordem de pagamento
    const paymentOrder = await getRepository(PaymentOrder).save({
      value: takebackFeeAmount + cashbackAmount + backAmount,
      company,
      status: approvedStatus,
      paymentMethod,
    });

    // Aprovando as transações
    const useCase = new ApproveTransactionUseCase(paymentOrder.id);

    for (const item of transactions) {
      await useCase.execute({
        companyName: paymentOrder.company.fantasyName,
        consumersId: item.consumer_id,
        totalAmount: item.transaction_totalAmount,
        transactionId: item.transaction_id,
      });
    }

    // Autorizando cashback para os clientes
    consumerToChangeBalance.map(async (item) => {
      const consumerBalance = await getRepository(Consumers).findOne(
        item.consumerId
      );

      const balanceUpdated = await getRepository(Consumers).update(
        item.consumerId,
        {
          blockedBalance: consumerBalance.blockedBalance - item.value,
          balance: consumerBalance.balance + item.value,
        }
      );

      if (balanceUpdated.affected === 0) {
        throw new InternalError(
          "Houve um erro ao atualizar o saldo do consumidor",
          400
        );
      }
    });

    const updateBalance = await getRepository(Companies).update(companyId, {
      positiveBalance:
        company.positiveBalance -
        (takebackFeeAmount + cashbackAmount + backAmount),
      negativeBalance:
        company.negativeBalance -
        (takebackFeeAmount + cashbackAmount + backAmount),
    });

    if (updateBalance.affected === 0) {
      throw new InternalError(
        "Houve um erro ao atualizar o saldo da empresa",
        400
      );
    }

    await new UpdateCompanyStatusByTransactionsUseCase().execute(companyId);

    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    const html = template({
      title: `Cashbacks liberados 🤑`,
      sectionOne: `Você acabou de alegrar o dia de ${consumerToChangeBalance.length} dos seus clientes disponibilizando o saldo deles.`,
      sectionTwo: `Ordem de pagamento N°${
        paymentOrder.id
      } | Valor liberado: ${applyCurrencyMask(
        cashbackAmount
      )} | Taxas operacionais: ${applyCurrencyMask(
        takebackFeeAmount
      )} | Total: ${applyCurrencyMask(paymentOrder.value)}`,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: company.email,
      subject: "TakeBack | Liberação de Cashbacks",
      html,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return "Houve um erro ao enviar o email.";
      } else {
        return "Email enviado.";
      }
    });

    return "Cashbacks liberados 🤑";
  }
}

export { GeneratePaymentOrderWithTakebackBalanceUseCase };
