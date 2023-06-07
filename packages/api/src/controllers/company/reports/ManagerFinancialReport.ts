import { DateTime } from "luxon";
import { db } from "../../../knex";
import { BaseQueryDto, BaseReport } from "../../../reports/BaseReport";
import { currency } from "../../../utils/Masks";

export enum OrderByColumn {
  TRANSACTION_STATUS = "transactionStatus",
}

interface Filter {
  dateStart?: string;
  dateEnd?: string;
  monthlyPaymentStatus?: number;
  transactionStatus?: number;
  citiesIds?: Array<number>;
  statesIds?: Array<number>;
  sort?: string;
}

interface ReportResponse {
  companyId: string;
  monthlyPaymentBilling: number;
  feeBilling: number;
  newClientsTotalValue: number;
  purchasesTotalValue: number;
  companyName: string;
  totalInPeriod: number;
}

const NEW_USER_BONUS_TYPE = "NEW_USER";
const SELL_BONUS_TYPE = "SELL";

const HEADERS = [
  "Faturamento Taxas",
  "Faturamento Mensalidades",
  "Total Gratificação por Compra",
  "Total Gratificação por Novo Usuário",
  "Saldo Período",
  "Nome da Empresa",
];

export class ManagerFinancialReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS);
  }

  protected excelRow(record: ReportResponse) {
    return {
      monthlyPaymentBilling: currency(record.monthlyPaymentBilling),
      feeBilling: currency(record.feeBilling),
      companyName: record.companyName,
      newClientsTotalValue: currency(record.newClientsTotalValue),
      purchasesTotalValue: currency(record.purchasesTotalValue),
    };
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record));
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const {
      transactionStatus,
      monthlyPaymentStatus,
      dateStart,
      dateEnd,
      orderByColumn = OrderByColumn.TRANSACTION_STATUS,
      order = "asc",
      citiesIds,
      statesIds,
      sort,
    } = dto ?? {};

    const query = db
      .select(
        "companies.id as companyId",
        "companies.fantasyName as companyName",
        db.raw(
          'sum("company_monthly_payment"."amountPaid") as "monthlyPaymentBilling"'
        ),
        db.raw('sum("industries"."industryFee") as "feeBilling"'),
        db.raw(
          'sum("bonus"."value") filter (where "bonus"."type" = ?) as "newClientsTotalValue"',
          [NEW_USER_BONUS_TYPE]
        ),
        db.raw(
          'sum("bonus"."value") filter (where "bonus"."type" = ?) as "purchasesTotalValue"',
          [SELL_BONUS_TYPE]
        ),
        db.raw(
          'sum(sum("industries"."industryFee") + sum("company_monthly_payment"."amountPaid") + sum("bonus"."value") filter (where "bonus"."type" = ?) + sum("bonus"."value") filter (where "bonus"."type" = ?)) as "totalInPeriod"'
        ),
        [NEW_USER_BONUS_TYPE, SELL_BONUS_TYPE]
      )
      .from("companies")
      .join(
        "companies_address",
        "companies_address.companiesId",
        "companies.id"
      )
      .leftJoin(
        "company_monthly_payment",
        "company_monthly_payment.companyId",
        "companies.id"
      )
      .join("city", "city.id", "companies_address.cityId")
      .join("transactions", "transactions.companiesId", "companies.id")
      .leftJoin("bonus", "bonus.transactionId", "transactions.id")
      .join("industries", "industries.id", "companies.industryId")
      .groupBy("city.id", "companies.id")
      .orderBy(orderByColumn, order);

    if (sort) {
      JSON.parse(sort, (key, value) => {
        if (value === null) {
          return undefined;
        }

        value.length && query.orderBy(key, value as "asc" | "desc");
      });
    }

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

    if (monthlyPaymentStatus) {
      query.where("company_monthly_payment.isPaid", monthlyPaymentStatus);
    }

    if (transactionStatus) {
      query.where("transaction_status.id", transactionStatus);
    }

    if (citiesIds) {
      query.whereIn("companies_address.cityId", citiesIds);
    }

    if (statesIds) {
      query.whereIn("city.stateId", statesIds);
    }

    return query;
  }
}
