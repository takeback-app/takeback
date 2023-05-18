import { DateTime, Settings } from "luxon";

import { db } from "../knex";
import { BaseQueryDto, BaseReport } from "./BaseReport";
import { currency, maskPhone } from "../utils/Masks";

export enum OrderByColumn {
  TOTAL_AMOUNT = "totalAmount",
  FULL_NAME = "consumers.fullName",
  CASHBACK_APPROVED = "cashbackApproved",
  TRANSACTION_COUNT = "transactionCount",
}

interface Filter {
  dateStart?: string;
  dateEnd?: string;
}

interface ReportResponse {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  totalAmount: number;
  cashbackApproved: number;
  transactionCount: number;
  lastTransactionDate: Date;
}

const APPROVED_TRANSACTION_STATUS_ID = 2;

const HEADERS = [
  "Nome",
  "Telefone",
  "Cidade",
  "Estado",
  "Total de Compras",
  "Total de Cashback Ganho",
  "Quantidade de Visitas",
  "Data da Última Transação",
];

export class CompanyClientsReport extends BaseReport<ReportResponse, Filter> {
  constructor(protected companyId: string) {
    super(HEADERS);
  }

  protected excelRow(record: ReportResponse) {
    return {
      fullName: record.fullName,
      phone: record.phone.trim() ? maskPhone(record.phone) : "-",
      city: record.city,
      state: record.state,
      totalAmount: currency(record.totalAmount),
      cashbackApproved: currency(record.cashbackApproved),
      transactionCount: String(record.transactionCount),
      lastTransactionDate: DateTime.fromJSDate(
        record.lastTransactionDate
      ).toFormat("dd/MM/yyyy"),
    };
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record));
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const {
      dateEnd,
      dateStart,
      orderByColumn = OrderByColumn.FULL_NAME,
      order = "asc",
    } = dto ?? {};

    const query = db
      .select(
        "consumers.id as id",
        "fullName",
        "phone",
        "city.name as city",
        "state.name as state",
        db.raw('sum("totalAmount") as "totalAmount"'),
        db.raw(
          'sum(case when transactions."transactionStatusId" = ? then transactions."cashbackAmount" else 0 end) as "cashbackApproved"',
          [APPROVED_TRANSACTION_STATUS_ID]
        ),
        db.raw('count(transactions.id) as "transactionCount"'),
        db.raw('max(transactions."createdAt") as "lastTransactionDate"')
      )
      .from("consumers")
      .join("consumer_address", "consumers.addressId", "consumer_address.id")
      .join("city", "consumer_address.cityId", "city.id")
      .join("state", "city.stateId", "state.id")
      .join("transactions", "consumers.id", "transactions.consumersId")
      .where("transactions.companiesId", this.companyId)
      .groupBy("consumers.id", "city.id", "state.id")
      .orderBy(orderByColumn, order);

    if (dateStart) {
      query.where(
        "transactions.createdAt",
        ">=",
        DateTime.fromISO(dateStart).startOf("day").toString()
      );
    }

    if (dateEnd) {
      query.where(
        "transactions.createdAt",
        "<=",
        DateTime.fromISO(dateEnd).startOf("day").toString()
      );
    }

    return query;
  }
}
