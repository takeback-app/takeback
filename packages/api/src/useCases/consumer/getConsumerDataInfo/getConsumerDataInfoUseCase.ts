import { Consumers } from "../../../database/models/Consumer";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { consumerRepository } from "../../../database/repositories/consumerRepository";
import { transactionsRepository } from "../../../database/repositories/transactionsRepository";

export class GetConsumerDataInfoUseCase {
  async execute(consumerId: string) {
    const consumerData = await consumerRepository().findOne({
      relations: ["address", "address.city"],
      where: {
        id: consumerId,
      },
    });

    const transactions = await transactionsRepository()
      .createQueryBuilder("t")
      .select("SUM(t.cashbackAmount)", "saved")
      .leftJoin(TransactionStatus, "status", "status.id = t.transactionStatus")
      .leftJoin(Consumers, "consumer", "consumer.id = t.consumers")
      .where("consumer.id = :consumerId", { consumerId })
      .andWhere("status.blocked = :blocked", { blocked: false })
      .getRawMany();

    return { consumerData, totalSaved: parseFloat(transactions[0].saved) };
  }
}
