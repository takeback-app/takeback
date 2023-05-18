import { getRepository, Not } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";

interface FindTransactionProps {
  offset: string;
  limit: string;
  consumerID: string;
}

class CostumerFindTransactionUseCase {
  async execute({ offset, limit, consumerID }: FindTransactionProps) {
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.cashbackAmount",
        "transaction.createdAt",
        "transaction.totalAmount",
      ])
      .addSelect([
        "company.fantasyName",
        "status.description",
        "status.id",
        "status.blocked",
      ])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .where("transaction.consumers = :consumerId", { consumerId: consumerID })
      .andWhere("status.description <> :status", { status: "Aguardando" })
      .orderBy("transaction.createdAt", "DESC")
      .getRawMany();

    return transactions;
  }
}

export { CostumerFindTransactionUseCase };
