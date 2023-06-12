import { DateTime } from "luxon";

import { db } from "../knex";
import { BaseQueryDto, BaseReport } from "./BaseReport";
import { currency, maskCNPJ, maskCPF } from "../utils/Masks";

interface Filter {
  dateStart?: string;
  dateEnd?: string;
  office?: number;
  transactionStatus?: number;
  companyStatus?: number;
  company?: string;
  citiesIds?: Array<number>;
  statesIds?: Array<number>;
  sort?: string;
}

interface ReportResponse {
  order: number;
  sellerName: string;
  cpf: string;
  description: string;
  companyName: string;
  registeredNumber: string;
  downloadedApp: string;
  totalAmount: number;
  newClients: number;
}

const NEW_USER_BONUS_TYPE = "NEW_USER";

const HEADERS = [
  "Ordem",
  "Nome do vendedor",
  "CPF",
  "Cargo",
  "Nome da Empresa",
  "CNPJ da Empresa",
  "Baixou o App",
  "Total de vendas",
  "Quantidade de novos clientes",
];

export class ManagerSelersReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS);
  }

  protected excelRow(record: ReportResponse) {
    return {
      order: String(record.order),
      sellerName: record.sellerName,
      cpf: record.cpf ? maskCPF(record.cpf) : "-",
      description: record.description,
      companyName: record.companyName,
      registeredNumber: record.registeredNumber
        ? maskCNPJ(record.registeredNumber)
        : "-",
      downloadedApp: record.downloadedApp,
      totalAmount: record.totalAmount ? currency(record.totalAmount) : "0",
      newClients: String(record.newClients),
    };
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record));
  }

  public getQuery(dto: Filter & BaseQueryDto) {
    const {
      dateStart,
      dateEnd,
      office,
      transactionStatus,
      companyStatus,
      company,
      citiesIds,
      statesIds,
      sort,
    } = dto ?? {};

    const query = db
      .select(
        "company_users.id",
        db.raw('ROW_NUMBER() OVER (ORDER BY "company_users"."id") AS "order"'),
        "company_users.name AS sellerName",
        "company_users.cpf",
        "company_user_types.description",
        "companies.fantasyName AS companyName",
        "companies.registeredNumber",
        db.raw(
          'CASE WHEN "consumers"."id" IS NOT NULL AND "consumers"."isPlaceholderConsumer" IS NOT FALSE THEN \'Sim\' ELSE \'Não\' END AS "downloadedApp"'
        ),
        db.raw('SUM("transactions"."totalAmount") AS "totalAmount"'),
        db.raw(
          'COUNT("bonus"."transactionId") FILTER (where "bonus"."type" = ?) AS "newClients"',
          [NEW_USER_BONUS_TYPE]
        )
      )
      .from("company_users")
      .leftJoin(
        "company_user_types",
        "company_user_types.id",
        "company_users.companyUserTypesId"
      )
      .leftJoin(
        "transactions",
        "transactions.companyUsersId",
        "company_users.id"
      )
      .leftJoin(
        "transaction_status",
        "transactions.transactionStatusId",
        "transaction_status.id"
      )
      .leftJoin("bonus", "bonus.transactionId", "transactions.id")
      .leftJoin("companies", "companies.id", "company_users.companyId")
      .leftJoin(
        "companies_address",
        "companies.addressId",
        "companies_address.id"
      )
      .leftJoin("city", "city.id", "companies_address.cityId")
      .leftJoin("consumers", "consumers.cpf", "company_users.cpf")
      .groupBy(
        "company_users.id",
        "company_users.cpf",
        "company_user_types.description",
        "companies.fantasyName",
        "companies.registeredNumber",
        "consumers.id"
      );

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
        DateTime.fromISO(dateEnd).endOf("day").toString()
      );
    }

    if (office) {
      query.where("company_user_types.id", office);
    }

    if (transactionStatus) {
      query.where("transaction_status.id", transactionStatus);
    }

    if (companyStatus) {
      query.where("companies.statusId", companyStatus);
    }

    if (citiesIds) {
      query.whereIn("companies_address.cityId", citiesIds);
    }

    if (statesIds) {
      query.whereIn("city.stateId", statesIds);
    }

    if (company) {
      query.where((q) => {
        q.whereLike("companies.fantasyName", `%${dto.company}%`)
          .orWhereLike("companies.corporateName", `%${dto.company}%`)
          .orWhereLike(
            "companies.registeredNumber",
            `%${dto.company.replace(/[^\d]/g, "")}%`
          );
      });
    }

    return query;
  }
}
