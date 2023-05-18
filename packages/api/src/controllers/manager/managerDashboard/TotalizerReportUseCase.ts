import { getRepository, Between } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";
import { Consumers } from "../../../database/models/Consumer";
import { Settings } from "../../../database/models/Settings";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { prisma } from "../../../prisma";

class TotalizerReportUseCase {
  async execute() {
    const companies = await getRepository(Companies)
      .createQueryBuilder("company")
      .select("SUM(company.positiveBalance)", "positiveBalance")
      .addSelect("SUM(company.negativeBalance)", "negativeBalance")
      .addSelect("COUNT(company.id)", "length")
      .getRawOne();

    const consumers = await getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select("SUM(consumer.balance)", "totalBalance")
      .addSelect("SUM(consumer.blockedBalance)", "totalBlockedBalance")
      .addSelect("COUNT(consumer.id)", "length")
      .where("consumer.deactivedAccount = :deactived", { deactived: false })
      .getRawOne();

    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select("SUM(transaction.takebackFeeAmount)", "takebackFeeAmount")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("status.description IN (:...status)", {
        status: ["Pendente", "Aguardando", "Em processamento", "Em atraso"],
      })
      .getRawOne();

    const labels = ["Empresas", "Clientes"];
    const values = [parseFloat(companies.length), parseFloat(consumers.length)];

    const companieAndConsumers = {
      labels,
      values,
    };

    const transactionsPendingAmount =
      parseFloat(companies.negativeBalance) -
      parseFloat(transactions.takebackFeeAmount);

    // CALCULANDO OS TOTALIZADORES DE MENSALIDADES
    let monthlyPaymentToPay = 0;
    let monthlyPaymentPaid = 0;
    let monthlyPaymentNotPaid = 0;

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyPayment = await getRepository(CompanyMonthlyPayment).find({
      where: {
        createdAt: Between(firstDay, lastDay),
      },
    });

    const expiredBalanceValue = await prisma.consumerExpireBalances.aggregate({
      _sum: { balance: true },
    });

    const settings = await getRepository(Settings).findOne({
      where: { id: 1 },
    });

    monthlyPayment.map((item) => {
      if (item.isPaid) {
        monthlyPaymentPaid =
          parseFloat(monthlyPaymentPaid.toFixed(4)) +
          parseFloat(item.amountPaid.toFixed(4));
      } else if (today.getDate() > settings.payDate && !item.isForgiven) {
        monthlyPaymentNotPaid =
          parseFloat(monthlyPaymentNotPaid.toFixed(4)) +
          parseFloat(item.amountPaid.toFixed(4));
      }

      if (!item.isForgiven) {
        monthlyPaymentToPay =
          parseFloat(monthlyPaymentToPay.toFixed(4)) +
          parseFloat(item.amountPaid.toFixed(4));
      }
    });

    return {
      balanceOfCompanies: companies,
      balanceOfConsumers: consumers,
      transactionsPendingAmount,
      feePendingAmount: parseFloat(transactions.takebackFeeAmount),
      monthlyPaymentToPay,
      monthlyPaymentPaid,
      monthlyPaymentNotPaid,
      companieAndConsumers,
      expiredBalanceValue,
    };
  }
}

export { TotalizerReportUseCase };
