import { getRepository } from "typeorm";
import { Transactions } from "../../../database/models/Transaction";
import { generateReportExcel } from "../../../utils/GenerateReportExcel";
import { generateReportPDF } from "../../../utils/GenerateReportPDF";
import { unlink } from "fs";
import { Companies } from "../../../database/models/Company";
import { TransactionPaymentMethods } from "../../../database/models/TransactionPaymentMethod";
import { CompanyPaymentMethods } from "../../../database/models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../database/models/PaymentMethod";
import { PaymentOrder } from "../../../database/models/PaymentOrder";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { Consumers } from "../../../database/models/Consumer";
import { maskCurrency } from "../../../utils/Masks";

interface FilterProps {
  dataStart?: string;
  dataEnd?: string;
  companyId?: string;
  consumerId?: string;
  statusId?: string;
  paymentOrderId?: string;
  paymentMethodId?: string;
}

interface Props {
  filters?: FilterProps;
}

class CashbackReportsUseCase {
  async execute({ filters }: Props) {
    const query = await getRepository(Transactions)
      .createQueryBuilder("transactions")
      .select([
        "transactions.cashbackAmount",
        "transactions.takebackFeeAmount",
        "transactions.createdAt",
        "transactions.id",
        "transactions.totalAmount",
      ])
      .addSelect([
        "paymentMethods.description",
        "tPaymentMethods.cashbackValue",
        "companies.fantasyName",
        "paymentOrder.id",
        "transactionStatus.description",
        "consumers.fullName",
      ])
      .leftJoin(Companies, "companies", "companies.id = transactions.companies")
      .leftJoin(
        TransactionPaymentMethods,
        "tPaymentMethods",
        "tPaymentMethods.transactions = transactions.id"
      )
      .leftJoin(
        CompanyPaymentMethods,
        "cPaymentMethods",
        "cPaymentMethods.id = tPaymentMethods.paymentMethod "
      )
      .leftJoin(
        PaymentMethods,
        "paymentMethods",
        "paymentMethods.id = cPaymentMethods.paymentMethod "
      )
      .leftJoin(
        PaymentOrder,
        "paymentOrder",
        "paymentOrder.id = transactions.paymentOrder"
      )
      .leftJoin(
        TransactionStatus,
        "transactionStatus",
        "transactionStatus.id = transactions.transactionStatus"
      )
      .leftJoin(Consumers, "consumers", "consumers.id = transactions.consumers")
      .groupBy("tPaymentMethods.id")
      .addGroupBy("transactions.takebackFeeAmount")
      .addGroupBy("transactions.cashbackAmount")
      .addGroupBy("transactions.createdAt")
      .addGroupBy("companies.fantasyName")
      .addGroupBy("paymentMethods.description")
      .addGroupBy("paymentOrder.id")
      .addGroupBy("transactionStatus.description")
      .addGroupBy("consumers.fullName")
      .addGroupBy("transactions.id");

    if (filters.statusId) {
      query.where("transactionStatus.id = :statusId", {
        statusId: filters.statusId,
      });
    }

    if (filters.companyId) {
      query.andWhere("companies.id = :companyId", {
        companyId: filters.companyId,
      });
    }

    if (filters.consumerId) {
      query.andWhere("consumers.id = :consumerId", {
        consumerId: filters.consumerId,
      });
    }

    if (filters.paymentOrderId) {
      query.andWhere("paymentOrder.id = :paymentOrderId", {
        paymentOrderId: filters.paymentOrderId,
      });
    }

    if (filters.paymentMethodId) {
      query.andWhere("paymentMethods.id = :paymentMethodId", {
        paymentMethodId: filters.paymentMethodId,
      });
    }

    if (filters.dataStart) {
      const date = new Date(filters.dataStart);
      date.setDate(date.getDate());

      query.andWhere(`transactions.createdAt >= '${date.toISOString()}'`);
    }

    if (filters.dataEnd) {
      const date = new Date(filters.dataEnd);
      date.setDate(date.getDate() + 1);

      query.andWhere(`transactions.createdAt <= '${date.toISOString()}'`);
    }

    const report = await query.getRawMany();

    // Agrupando as transações por metodos de pagamento
    const transactionsReduced = report.reduce((previousValue, currentValue) => {
      previousValue[currentValue.transactions_id] =
        previousValue[currentValue.transactions_id] || [];
      previousValue[currentValue.transactions_id].push(currentValue);
      return previousValue;
    }, Object.create(null));

    // Alterando o formato do agrupamento para um formato compatível para mapeamento
    const transactionGroupedPerMethods = [];
    for (const [key, values] of Object.entries(transactionsReduced)) {
      transactionGroupedPerMethods.push({
        transactionId: key,
        transactions: values,
      });
    }

    // GERANDO EXCEL
    const title = [
      "ID",
      "Empresa",
      "Forma de pagamento",
      "Cliente",
      "Valor",
      "Taxa",
      "Cashback",
      "Total a pagar",
      "Ordem",
      "Status",
      "Data",
    ];
    const titles = [];
    for await (let headerTitles of title) {
      titles.push({ text: headerTitles, style: "tableHeader" });
    }

    const excelData = [];
    for await (let result of report) {
      const cells = [];

      const total =
        parseInt(result.transactions_takebackFeeAmount) +
        parseInt(result.transactions_cashbackAmount);

      const totalString = total.toString();

      cells.push(
        result.transactions_id.toString(),
        result.companies_fantasyName,
        result.paymentMethods_description,
        result.consumers_fullName,
        maskCurrency(result.transactions_totalAmount),
        maskCurrency(result.transactions_takebackFeeAmount),
        maskCurrency(result.transactions_cashbackAmount),
        totalString,
        result.paymentOrder_id.toString(),
        result.transactionStatus_description,
        new Date(result.transactions_createdAt).toLocaleDateString()
      );

      excelData.push(cells);
    }

    const excelName = generateReportExcel({
      titles: title,
      data: excelData,
      reportName: "Relatório de Cashbacks",
    });

    const filePathExcel = `${process.env.API_URL}/uploads/reports/${excelName}.xlsx`;

    return { transactionGroupedPerMethods, filePathExcel };
  }
}

export { CashbackReportsUseCase };
