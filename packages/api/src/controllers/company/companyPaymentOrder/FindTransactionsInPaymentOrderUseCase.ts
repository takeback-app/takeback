import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsers } from "../../../database/models/CompanyUsers";
import { Consumers } from "../../../database/models/Consumer";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { prisma } from "../../../prisma";

interface Props {
  paymentOrderId: number;
  companyId: string;
}

class FindTransactionsInPaymentOrderUseCase {
  async execute({ paymentOrderId, companyId }: Props) {
    if (!paymentOrderId) {
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
        "transaction.dateAt",
        "transaction.createdAt",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
        "transaction.backAmount",
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
      .where("transactionInPaymentOrder.id = :paymentOrderId", {
        paymentOrderId,
      })
      .andWhere("transactionInPaymentOrder.company = :companyId", { companyId })
      .orderBy("transaction.id")
      .getRawMany();

    return transactionsInPaymentOrder;
  }
}

export { FindTransactionsInPaymentOrderUseCase };
