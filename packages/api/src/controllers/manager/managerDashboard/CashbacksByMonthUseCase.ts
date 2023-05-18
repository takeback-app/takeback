import { getRepository } from "typeorm";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../database/models/PaymentMethod";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionPaymentMethods } from "../../../database/models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../database/models/TransactionStatus";

class CashbacksByMonthUseCase {
  async execute() {
    const transactionsBilling = await getRepository(TransactionPaymentMethods)
      .createQueryBuilder("paymentMethod")
      .select("SUM(paymentMethod.cashbackValue)", "billing")
      .addSelect("DATE_TRUNC('month', transaction.createdAt)", "date")
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.id = paymentMethod.transactions"
      )
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .leftJoin(
        CompanyPaymentMethods,
        "companyPaymentMethod",
        "companyPaymentMethod.id = paymentMethod.paymentMethod"
      )
      .leftJoin(
        PaymentMethods,
        "method",
        "method.id = companyPaymentMethod.paymentMethod"
      )
      .where("status.description = :status", { status: "Aprovada" })
      .andWhere("method.isTakebackMethod = :isTakeback", { isTakeback: false })
      .groupBy("DATE_TRUNC('month', transaction.createdAt)")
      .getRawMany();

    const transactionsTakebackBilling = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select("SUM(transaction.takebackFeeAmount)", "takebackBilling")
      .addSelect("DATE_TRUNC('month', transaction.createdAt)", "date")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("status.description = :status", { status: "Aprovada" })
      .groupBy("DATE_TRUNC('month', transaction.createdAt)")
      .getRawMany();

    const transactionsBillingLabels = [];
    const transactionsBillingValues = [];
    const transactionsTakebackBillingLabels = [];
    const transactionsTakebackBillingValues = [];

    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    transactionsBilling.map((item) => {
      transactionsBillingLabels.push(months[new Date(item.date).getMonth()]);
      transactionsBillingValues.push(parseFloat(item.billing));
    });

    transactionsTakebackBilling.map((item) => {
      transactionsTakebackBillingLabels.push(
        months[new Date(item.date).getMonth()]
      );
      transactionsTakebackBillingValues.push(parseFloat(item.takebackBilling));
    });

    const companyBilling = {
      transactionsBillingLabels,
      transactionsBillingValues,
    };
    const takebackBilling = {
      transactionsTakebackBillingLabels,
      transactionsTakebackBillingValues,
    };

    return { companyBilling, takebackBilling };
  }
}

export { CashbacksByMonthUseCase };
