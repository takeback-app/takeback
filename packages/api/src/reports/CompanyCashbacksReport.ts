import { BaseQueryDto, BaseReport } from "./BaseReport";
import { db } from "../knex";
import { DateTime } from "luxon";
import { currency } from "../utils/Masks";

export enum OrderByColumn {
  TOTAL_AMOUNT = "totalAmount",
  CASHBACK_VALUE = "cashbackAmount",
  TAKEBACK_FEE_VALUE = "takebackFeeAmount",
}

interface Filter {
  dateStart?: string;
  dateEnd?: string;
  cashbackStatus: number;
  paymentMethodType: number;
}

interface ReportResponse {
  id: number;
  totalAmount: number;
  cashbackAmount: number;
  takebackFeeAmount: number;
  backAmount: number;
  createdAt: Date;
  fullName: string;
  status: string;
  paymentMethod: string;
  isTakebackMethod: boolean;
  companyTotalPay: number;
}

const HEADERS = [
  "Ordem",
  "Nome",
  "Status",
  "Forma de Pagamento",
  "Valor da Compra",
  "Taxa Takeback",
  "Cashback",
  "Troco",
  "Valor a Pagar",
  "Data da Emissão",
];

export class CompanyCashbacksReport extends BaseReport<ReportResponse, Filter> {
  constructor(protected companyId: string) {
    super(HEADERS);
  }

  protected excelRow(record: ReportResponse) {
    return {
      id: record.id,
      fullName: record.fullName,
      status: record.status,
      paymentMethod: record.paymentMethod,
      totalAmount: currency(record.totalAmount),
      takebackFeeAmount: currency(record.takebackFeeAmount),
      cashbackAmount: currency(record.cashbackAmount),
      backAmount: currency(record.backAmount),
      companyTotalPay: currency(record.companyTotalPay),
      createdAt: DateTime.fromJSDate(record.createdAt).toFormat("dd/MM/yyyy"),
    };
  }

  protected pdfRow(record: ReportResponse) {
    const excelRow = this.excelRow(record);

    return Object.values(excelRow).map((value) => String(value));
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const {
      dateStart,
      dateEnd,
      orderByColumn = OrderByColumn.TOTAL_AMOUNT,
      order = "asc",
      cashbackStatus,
      paymentMethodType,
    } = dto ?? {};

    const query = db
      .select(
        "transactions.id",
        "transactions.totalAmount",
        "transactions.cashbackAmount",
        "transactions.takebackFeeAmount",
        "transactions.backAmount",
        "transactions.createdAt",
        "consumers.fullName",
        "transaction_status.description as status",
        db.raw('max(payment_methods.description) as "paymentMethod"'),
        db.raw(
          'sum("cashbackAmount" + "takebackFeeAmount" + "backAmount") as "companyTotalPay"'
        )
      )
      .from("transactions")
      .join("consumers", "transactions.consumersId", "consumers.id")
      .join(
        "transaction_status",
        "transactions.transactionStatusId",
        "transaction_status.id"
      )
      .join(
        "transaction_payment_methods",
        "transactions.id",
        "transaction_payment_methods.transactionsId"
      )
      .leftJoin(
        "company_payment_methods",
        "transaction_payment_methods.paymentMethodId",
        "company_payment_methods.id"
      )
      .leftJoin(
        "payment_methods",
        "company_payment_methods.paymentMethodId",
        "payment_methods.id"
      )
      .where("transactions.companiesId", this.companyId)
      .groupBy("transactions.id", "transaction_status.id", "consumers.id")
      .orderBy(orderByColumn, order);

    if (dateStart) {
      query.where(
        "transactions.createdAt",
        ">=",
        DateTime.fromISO(dateStart).startOf("day").toJSDate()
      );
    }

    if (dateEnd) {
      query.where(
        "transactions.createdAt",
        "<=",
        DateTime.fromISO(dateEnd).startOf("day").toJSDate()
      );
    }

    if (cashbackStatus) {
      query.where("transactions.transactionStatusId", cashbackStatus);
    }

    if (paymentMethodType) {
      query.where("payment_methods.id", paymentMethodType);
    }

    return query;
  }
}
