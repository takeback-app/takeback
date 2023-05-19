import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { Consumers } from "../../../database/models/Consumer";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { CancelTransactionUseCase } from "../../../useCases/cashback/CancelTransactionUseCase";

interface CancelProps {
  transactionIDs: number[];
  cancellationDescription: string;
  companyId: string;
}

class CancelCashBackUseCase {
  async execute({
    cancellationDescription,
    transactionIDs,
    companyId,
  }: CancelProps) {
    // Verificando se os dados necessários foram informados
    if (!cancellationDescription || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    // Buscando o status de cancelada pelo parceiro para atualizar a transação
    const status = await getRepository(TransactionStatus).findOne({
      where: { description: "Cancelada pelo parceiro" },
    });

    // Verificando se o status foi localizado
    if (!status) {
      throw new InternalError("Erro ao cancelar transação", 400);
    }

    // Buscando todas as transações informadas pelo usuário
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.takebackFeePercent",
        "transaction.takebackFeeAmount",
        "transaction.cashbackPercent",
        "transaction.cashbackAmount",
        "transaction.amountPayWithOthersMethods",
        "transaction.amountPayWithTakebackBalance",
      ])
      .addSelect(["consumer.id", "status.description"])
      .where("transaction.id IN (:...transactionIDs)", {
        transactionIDs: [...transactionIDs],
      })
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
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

    const consumersAndValuesToAdjustBalances = [];
    // Somando os valores das transações e agrupando por usuário
    transactionGroupedPerConsumer.map((item) => {
      let valueToSubtractBlockedBalance = 0;
      let valueToAddInBalance = 0;

      item.transactions.map((transaction) => {
        valueToSubtractBlockedBalance =
          valueToSubtractBlockedBalance +
          parseFloat(transaction.transaction_cashbackAmount);
        valueToAddInBalance =
          valueToAddInBalance +
          parseFloat(transaction.transaction_amountPayWithTakebackBalance);
      });

      consumersAndValuesToAdjustBalances.push({
        consumerId: item.consumerId,
        valueToSubtractBlockedBalance,
        valueToAddInBalance,
      });
    });

    // Percorrendo cada uma das transações localizadas
    const cancelUseCase = new CancelTransactionUseCase();

    // Percorrendo cada uma das transações localizadas
    for (const transaction of transactions) {
      await cancelUseCase.execute({
        transactionId: transaction.transaction_id,
        cancellationDescription,
      });
    }

    // Mapeando os usuários agrupados nas transações
    let valueToSubtractCompanyPositiveBalance = 0;
    consumersAndValuesToAdjustBalances.map(async (item) => {
      valueToSubtractCompanyPositiveBalance =
        valueToSubtractCompanyPositiveBalance + item.valueToAddInBalance;

      const balanceOfConsumer = await getRepository(Consumers).findOne(
        item.consumerId
      );

      // Atualizando o valor do salndo pendente dos usuários
      const balanceConsumerUpdated = await getRepository(Consumers).update(
        item.consumerId,
        {
          blockedBalance:
            balanceOfConsumer.blockedBalance -
            item.valueToSubtractBlockedBalance,
          balance: balanceOfConsumer.balance + item.valueToAddInBalance,
        }
      );

      if (balanceConsumerUpdated.affected === 0) {
        throw new InternalError("Erro ao atualizar o saldo do cliente", 400);
      }
    });

    // Buscando a empresa para pegar o saldo da mesma
    const companyBalance = await getRepository(Companies).findOne(companyId);

    // Somando o valor total a ser descontado do saldo negativo da empresa
    let valueToUpdateCompanyBalance = 0;
    transactions.map((item) => {
      valueToUpdateCompanyBalance =
        valueToUpdateCompanyBalance +
        parseFloat(item.transaction_takebackFeeAmount) +
        parseFloat(item.transaction_cashbackAmount);
    });

    // Atualizando o saldo negativo da empresa
    const updatedCompanyNegativeBalance = await getRepository(Companies).update(
      companyId,
      {
        negativeBalance:
          companyBalance.negativeBalance - valueToUpdateCompanyBalance,
        positiveBalance:
          companyBalance.positiveBalance -
          valueToSubtractCompanyPositiveBalance,
      }
    );

    if (updatedCompanyNegativeBalance.affected === 0) {
      throw new InternalError("Erro ao atualizar o saldo da empresa", 400);
    }

    return true;
  }
}

export { CancelCashBackUseCase };
