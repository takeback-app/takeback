import { Not } from "typeorm";
import { transactionsRepository } from "../../../database/repositories/transactionsRepository";
import { transfersRepository } from "../../../database/repositories/transfersRepository";

export class GetAllConsumerTransactionsUseCase {
  async execute(consumerId: string) {
    const transactions = await transactionsRepository().find({
      where: { consumers: consumerId, transactionStatus: Not(4) },
      relations: ["companies", "transactionStatus", "consumers"],
    });

    const transfers = await transfersRepository().find({
      where: [{ consumerSent: consumerId }, { consumerReceived: consumerId }],
      relations: ["consumerSent", "consumerReceived"],
    });

    const tempTransactions = [];
    transactions.map((item) => {
      tempTransactions.push({
        id: item.id,
        value: item.totalAmount,
        backAmount: item.backAmount,
        cashbackAmount: item.cashbackAmount,
        cashbackPercent: item.cashbackPercent,
        amountPayWithTakebackBalance: item.amountPayWithTakebackBalance,
        amountPayWithOthersMethods: item.amountPayWithOthersMethods,
        fantasyName: item.companies.fantasyName,
        statusId: item.transactionStatus.id,
        statusDescription: item.transactionStatus.description,
        cancellationDescription: item.cancellationDescription,
        createdAt: item.createdAt,
        isTransfer: false,
        isReceived: null,
        consumerReceivedName: "",
        consumerSentName: "",
      });
    });

    const tempTransfers = [];
    transfers.map((item) => {
      tempTransfers.push({
        id: item.id,
        value: item.value,
        backAmount: 0,
        cashbackAmount: 0,
        cashbackPercent: 0,
        amountPayWithTakebackBalance: 0,
        amountPayWithOthersMethods: 0,
        fantasyName: "",
        statusId: 0,
        statusDescription: "",
        cancellationDescription: "",
        createdAt: item.createdAt,
        isTransfer: true,
        isReceived: item.consumerReceived.id === consumerId,
        consumerReceivedName: item.consumerReceived.fullName,
        consumerSentName: item.consumerSent.fullName,
      });
    });

    const data = [...tempTransactions, ...tempTransfers];

    function compare(a, b) {
      return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1;
    }

    const finalData = data.sort(compare);

    return finalData;
  }
}
