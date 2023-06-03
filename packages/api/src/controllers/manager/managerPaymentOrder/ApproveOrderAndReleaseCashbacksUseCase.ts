import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Consumers } from "../../../database/models/Consumer";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { PaymentOrderStatus } from "../../../database/models/PaymentOrderStatus";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { applyCurrencyMask } from "../../../utils/Masks";
import transporter from "../../../config/SMTP";
import path from "path";
import fs from "fs";
import hbs from "handlebars";
import { logger } from "../../../services/logger";
import { ApproveTransactionUseCase } from "../../../useCases/cashback/ApproveTransactionUseCase";

interface OrderProps {
  paymentOrderId: number;
}

class ApproveOrderAndReleaseCashbacksUseCase {
  async execute({ paymentOrderId }: OrderProps) {
    if (!paymentOrderId) {
      throw new InternalError("Ordem de pagamento não informada", 400);
    }

    // Verificando se a ordem de pagamento existe
    const paymentOrder = await getRepository(PaymentOrder).findOne({
      where: { id: paymentOrderId },
      relations: ["company"],
    });

    if (!paymentOrder) {
      throw new InternalError("Ordem de pagamento não localizada", 404);
    }

    // Encontrando transações pertencentes a ordem de pagamento
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
      .where("transaction.paymentOrder = :paymentOrderId", { paymentOrderId })
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

    // ATUALIZANDO AS TRANSAÇÕES
    // Buscando o status de transação aprovada
    const approvedStatusTransaction = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Aprovada" },
    });

    // Variáveis para receber os valores da taxa takeback, cashback e do troco
    let takebackFeeAmount = 0;
    let cashbackAmount = 0;
    let backAmount = 0;

    // Aprovando as transações da ordem de pagamento
    let transactionsUpdatedError = false;
    const useCase = new ApproveTransactionUseCase(paymentOrder.id);

    for (const item of transactions) {
      await useCase.execute({
        companiesId: paymentOrder.company.id,
        consumersId: item.consumer_id,
        totalAmount: item.transaction_totalAmount,
        transactionId: item.transaction_id,
      });

      // Inserindo valor da taxa takeback na transação
      takebackFeeAmount =
        takebackFeeAmount + parseFloat(item.transaction_takebackFeeAmount);

      // Inserindo valor do cashback na transação
      cashbackAmount =
        cashbackAmount + parseFloat(item.transaction_cashbackAmount);

      // Inserindo o valor do troco na transação
      backAmount = backAmount + parseFloat(item.transaction_backAmount);
    }

    // VERIFICANDO SE OUVE ALGUM ERRO E VOLTANDO AO STATUS ATUAL CASO TENHA OCORRIDO
    if (transactionsUpdatedError) {
      const processingTransactionStatus = await getRepository(
        TransactionStatus
      ).findOne({
        where: { description: "Em processamento" },
      });

      transactions.map(async (item) => {
        await getRepository(Transactions).update(item.transaction_id, {
          transactionStatus: processingTransactionStatus,
        });
      });

      throw new InternalError("Erro ao atualizar transação", 400);
    }

    // ATUALIZABDO O SALDO DOS CLIENTES
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

    // ATUALIZANDO O SALDO DA EMPRESA
    // Buscando a empresa da ordem de pagamento
    const company = await getRepository(Companies).findOne({
      where: { id: paymentOrder.company.id },
    });

    // Atualizando o saldo da empresa
    const updateBalance = await getRepository(Companies).update(
      paymentOrder.company.id,
      {
        negativeBalance: company.negativeBalance - paymentOrder.value,
      }
    );

    if (updateBalance.affected === 0) {
      throw new InternalError(
        "Houve um erro ao atualizar o saldo da empresa",
        400
      );
    }

    // ATUALIZANDO A ORDEM DE PAGAMENTO
    // Buscando o status de ordem de pagamento autorizada
    const approvedStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    // Atualizando o status da ordem de pagamento
    const paymentOrderUpdated = await getRepository(PaymentOrder).update(
      paymentOrderId,
      {
        status: approvedStatus,
        approvedAt: new Date(),
      }
    );

    if (paymentOrderUpdated.affected === 0) {
      throw new InternalError("Erro ao atualizar o status da transação", 400);
    }

    // VERIFICANDO SE HÁ TRANSAÇẼOS PENDENTES PARA ATUALIZAR O STATUS DA EMPRESA
    // Buscando as transações
    const verifyTransactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select(["transaction.id", "transaction.createdAt"])
      .addSelect(["status.description", "company.id"])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("company.id = :companyId", { companyId: paymentOrder.company.id })
      .andWhere("status.description = :status", { status: "Em atraso" })
      .getRawMany();

    // Buscando os status necessários
    const overStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Inadimplente por cashbacks" },
    });

    const activeStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Ativo" },
    });

    // Verificando se há alguma transação em atraso
    if (verifyTransactions.length > 0) {
      // Bloqueando a empresa caso tenha pelo menos uma transação em atraso
      await getRepository(Companies).update(paymentOrder.company.id, {
        status: overStatus,
      });

      logger.info(
        `Empresa (${paymentOrder.company.id}) atualizada para ${overStatus.description}`
      );
    } else {
      // Desbloqueando a empresa caso não haja mais cashbacks pendentes
      await getRepository(Companies).update(paymentOrder.company.id, {
        status: activeStatus,
      });
    }

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

    return "Ordem de Pagamento aprovada!";
  }
}

export { ApproveOrderAndReleaseCashbacksUseCase };
