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
  company?: string;
  statusIds?: Array<string>;
  paymentMethodIds?: Array<string>;
  consumer?: string;
  datePaidStart?: string;
  datePaidEnd?: string;
  dateExpiredStart?: string;
  dateExpiredEnd?: string;
}

interface Props {
  filters?: FilterProps;
}

class CashbackReportsUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(TransactionPaymentMethods)
      .createQueryBuilder("tPaymentMethods")
      .select(["tPaymentMethods.id", "tPaymentMethods.cashbackValue"])
      .addSelect([
        "transaction.id",
        "transaction.totalAmount",
        "transaction.takebackFeeAmount",
        "transaction.createdAt",
        "transaction.cashbackAmount",
        "transaction.aprovedAt",
        "company.fantasyName",
        "company.corporateName",
        "company.registeredNumber",
        "consumer.fullName",
        "consumer.cpf",
        "status.description",
        "paymentMethods.description",
        "paymentOrder.id",
      ])
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.id = tPaymentMethods.transactions"
      )
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .leftJoin(
        CompanyPaymentMethods,
        "cPaymentMethods",
        "cPaymentMethods.id = tPaymentMethods.paymentMethod"
      )
      .leftJoin(
        PaymentMethods,
        "paymentMethods",
        "paymentMethods.id = cPaymentMethods.paymentMethod"
      )
      .leftJoin(
        PaymentOrder,
        "paymentOrder",
        "paymentOrder.id = transaction.paymentOrder"
      );

    if (filters.statusIds) {
      const array = [...filters.statusIds];
      const newArray = [];

      array.map((item) => {
        newArray.push(item.replace(/\D/g, ""));
      });

      const myArrayWithoutSpaces = [];
      newArray.filter((res) => {
        if (res !== "") return myArrayWithoutSpaces.push(res);
      });

      query.andWhere("status.id IN (:...statusIds)", {
        statusIds: [...myArrayWithoutSpaces],
      });
    }

    if (filters.paymentMethodIds) {
      const array = [...filters.paymentMethodIds];
      const newArray = [];

      array.map((item) => {
        newArray.push(item.replace(/\D/g, ""));
      });

      const myArrayWithoutSpaces = [];
      newArray.filter((res) => {
        if (res !== "") return myArrayWithoutSpaces.push(res);
      });

      query.andWhere("paymentMethods.id IN (:...paymentMethodIds)", {
        paymentMethodIds: [...myArrayWithoutSpaces],
      });
    }

    if (filters.company) {
      query.andWhere("company.registeredNumber ILIKE :registeredNumber", {
        registeredNumber: `%${filters.company.replace(/\D/g, "")}%`,
      });
    }

    if (filters.consumer) {
      query.andWhere("consumer.cpf ILIKE :cpf", {
        cpf: `%${filters.consumer.replace(/\D/g, "")}%`,
      });
    }

    if (filters.dataStart) {
      const date = new Date(filters.dataStart);
      date.setDate(date.getDate());

      query.andWhere(`transaction.createdAt >= '${date.toISOString()}'`);
    }

    if (filters.dataEnd) {
      const date = new Date(filters.dataEnd);
      date.setDate(date.getDate() + 1);

      query.andWhere(`transaction.createdAt <= '${date.toISOString()}'`);
    }

    if (filters.datePaidStart) {
      const date = new Date(filters.datePaidStart);
      date.setDate(date.getDate());

      query.andWhere(`transaction.aprovedAt >= '${date.toISOString()}'`);
    }

    if (filters.datePaidEnd) {
      const date = new Date(filters.datePaidEnd);
      date.setDate(date.getDate() + 1);

      query.andWhere(`transaction.aprovedAt <= '${date.toISOString()}'`);
    }

    if (filters.dateExpiredStart) {
      const createdDate = new Date(filters.dateExpiredStart);

      createdDate.setDate(createdDate.getDate() - 10);

      query.andWhere(`transaction.createdAt >= '${createdDate.toISOString()}'`);
    }

    if (filters.dateExpiredEnd) {
      const createdDate = new Date(filters.dateExpiredEnd);

      createdDate.setDate(createdDate.getDate() - 9);

      query.andWhere(`transaction.createdAt <= '${createdDate.toISOString()}'`);
    }

    const report = await query.getRawMany();

    // GERANDO EXCEL
    const title = [
      "ID",
      "Empresa",
      "Cliente",
      "Forma de pagamento",
      "Valor da transação",
      "Taxa takeback",
      "Cashback",
      "Total a pagar",
      "Ordem de pagamento",
      "Status da transação",
      "Data de Emissão",
      "Data de Aprovação",
    ];
    const titles = [];
    for await (let headerTitles of title) {
      titles.push({ text: headerTitles, style: "tableHeader" });
    }

    const excelData = [];
    for await (let result of report) {
      const cells = [];

      let emissao = "";
      if (result.transaction_aprovedAt != null) {
        emissao = new Date(result.transaction_aprovedAt).toLocaleDateString();
      } else {
        emissao = "Não aprovada";
      }

      let ordem = "";
      if (result.paymentOrder_id != null) {
        ordem = result.paymentOrder_id;
      } else {
        ordem = "Não possui";
      }

      const total =
        parseFloat(result.transaction_takebackFeeAmount) +
        parseFloat(result.transaction_cashbackAmount);

      const totalString = total.toFixed(4).toString();

      cells.push(
        result.transaction_id.toString(),
        result.company_fantasyName.toString(),
        result.consumer_fullName.toString(),
        result.paymentMethods_description.toString(),
        maskCurrency(result.transaction_totalAmount.toString()),
        maskCurrency(result.transaction_takebackFeeAmount.toString()),
        maskCurrency(result.transaction_cashbackAmount.toString()),
        maskCurrency(totalString),
        " " + ordem,
        result.status_description,
        new Date(result.transaction_createdAt).toLocaleDateString(),
        emissao
      );

      excelData.push(cells);
    }

    const excelName = generateReportExcel({
      titles: title,
      data: excelData,
      reportName: "Relatório de Cashbacks",
    });

    const filePathExcel = `${process.env.API_URL}/uploads/reports/${excelName}.xlsx`;

    //GERANDO PDF
    const data = [];
    for await (let result of report) {
      const rows = [];

      let emissao = "";
      if (result.transaction_aprovedAt != null) {
        emissao = new Date(result.transaction_aprovedAt).toLocaleDateString();
      } else {
        emissao = "Não aprovada";
      }

      let ordem = "";
      if (result.paymentOrder_id != null) {
        ordem = result.paymentOrder_id;
      } else {
        ordem = "Não possui";
      }

      const total =
        parseFloat(result.transaction_takebackFeeAmount) +
        parseFloat(result.transaction_cashbackAmount);

      const totalString = total.toFixed(4).toString();

      rows.push(
        { text: result.transaction_id, style: "content" },
        { text: result.company_fantasyName, style: "content" },
        { text: result.consumer_fullName, style: "content" },
        { text: result.paymentMethods_description, style: "content" },
        {
          text: maskCurrency(result.transaction_totalAmount.toString()),
          style: "content",
        },
        {
          text: maskCurrency(result.transaction_takebackFeeAmount.toString()),
          style: "content",
        },
        {
          text: maskCurrency(result.transaction_cashbackAmount.toString()),
          style: "content",
        },
        {
          text: maskCurrency(totalString),
          style: "content",
        },
        {
          text: ordem,
          style: "content",
        },
        {
          text: result.status_description.toString(),
          style: "content",
        },
        {
          text: new Date(result.transaction_createdAt).toLocaleDateString(),
          style: "content",
        },
        {
          text: emissao,
          style: "content",
        }
      );

      data.push(rows);
    }

    const pdfName = generateReportPDF({
      titles,
      data,
      reportName: "Relatório de Cashbacks",
    });

    const filePathPDF = `${process.env.API_URL}/uploads/reports/${pdfName}.pdf`;

    const time = 60000;

    setTimeout(() => {
      unlink(`./uploads/reports/${pdfName}.pdf`, (err) => {
        if (err) {
          console.log(err);
        }
      });

      unlink(`./uploads/reports/${excelName}.xlsx`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }, time * 10); // 10 minutos */

    return { report, filePathExcel, filePathPDF };
  }
}

export { CashbackReportsUseCase };
