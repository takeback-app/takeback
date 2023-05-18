import { transactionsPaymentMethodRepository } from "../../../database/repositories/transactionsPaymentMethodRepository";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../database/models/PaymentMethod";
import { Transactions } from "../../../database/models/Transaction";

export class GetConsumerTransactionDetailsUseCase {
  async execute(transactionID: string) {
    const paymentMethods = await transactionsPaymentMethodRepository()
      .createQueryBuilder("transactionPaymentMethod")
      .select([
        "transactionPaymentMethod.id",
        "transactionPaymentMethod.cashbackPercentage",
        "transactionPaymentMethod.cashbackValue",
      ])
      .addSelect(["paymentMethod.id", "paymentMethod.description"])
      .leftJoin(
        CompanyPaymentMethods,
        "companyPaymentMethod",
        "companyPaymentMethod.id = transactionPaymentMethod.paymentMethod"
      )
      .leftJoin(
        PaymentMethods,
        "paymentMethod",
        "paymentMethod.id = companyPaymentMethod.paymentMethod"
      )
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.id = transactionPaymentMethod.transactions"
      )
      .where("transaction.id = :transactionID", { transactionID })
      .getRawMany();

    return paymentMethods;
  }
}
