import { getRepository } from "typeorm";
import { City } from "../../../database/models/City";
import { Companies } from "../../../database/models/Company";
import { CompaniesAddress } from "../../../database/models/CompanyAddress";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../database/models/PaymentMethod";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionPaymentMethods } from "../../../database/models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../database/models/TransactionStatus";

interface FindAppProps {
  transactionID: number;
}

class CostumerFindCashbackDetailsUseCase {
  async execute({ transactionID }: FindAppProps) {
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.totalAmount",
        "transaction.amountPayWithOthersMethods",
        "transaction.amountPayWithTakebackBalance",
        "transaction.cashbackPercent",
        "transaction.cashbackAmount",
        "transaction.cancellationDescription",
        "transaction.createdAt",
      ])
      .addSelect([
        "company.fantasyName",
        "address.street",
        "address.district",
        "address.number",
        "city.name",
        "status.id",
        "status.description",
      ])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("transaction.id = :transactionID", { transactionID })
      .getRawOne();

    const paymentMethods = await getRepository(TransactionPaymentMethods)
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

    return { transactions, paymentMethods };
  }
}

export { CostumerFindCashbackDetailsUseCase };
