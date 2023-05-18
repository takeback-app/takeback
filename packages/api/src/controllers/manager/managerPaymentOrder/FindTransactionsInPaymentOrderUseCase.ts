import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsers } from "../../../database/models/CompanyUsers";
import { Consumers } from "../../../database/models/Consumer";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";

interface Props {
  orderId?: string;
}

class FindTransactionsInPaymentOrderUseCase {
  async execute({ orderId }: Props) {
    if (!orderId) {
      throw new InternalError(
        "Indentificador da ordem de pagamento não informado",
        400
      );
    }

    const transactionsInPaymentOrder = await getRepository(PaymentOrder)
      .createQueryBuilder("transactionInPaymentOrder")
      .select([
        "transaction.id",
        "transaction.totalAmount",
        "transaction.createdAt",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
      ])
      .addSelect(["consumer.fullName", "status.description"])
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.paymentOrder = transactionInPaymentOrder.id"
      )
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(CompanyUsers, "user", "user.id = transaction.companyUsers")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )

      .orderBy("transaction.id")
      .where("transactionInPaymentOrder.id = :orderId", {
        orderId,
      })
      .getRawMany();

    return transactionsInPaymentOrder;
  }
}

export { FindTransactionsInPaymentOrderUseCase };
