import { db } from "../knex";
import { maskCNPJ, maskCurrency } from "../utils/Masks";
import { BaseQueryDto, BaseReport } from "./BaseReport";

export enum OrderByColumn {
  fantasyName = "companies.fantasyName",
  positiveBalance = "companies.positiveBalance",
  quantityOfPaidTransactions = "companies.positiveBalance",
  valueOfPaidTransactions = "valueOfPaidTransactions",
  valueOfTotalAmount = "valueOfTotalAmount",
}

interface Filter {
  statusIds?: string[];
  dataActivateStart?: string;
  dataActivateEnd?: string;
  dataCreatedStart?: string;
  dataCreatedEnd?: string;
  industryIds?: string[];
  cashbacksStatusIds?: string[];
  citiesIds?: string[];
  statesIds?: string[];
  company?: string;
  sort?: string;
}

interface ReportResponse {
  registeredNumber: string;
  fantasyName: string;
  corporateName: string;
  email: string;
  phone: string;
  firstAccessAllowedAt: string | Date;
  createdAt: string | Date;
  customIndustryFeeActive: boolean;
  customIndustryFee: string;
  positiveBalance: number;
  industries_description: string;
  industryFee: number;
  company_status_description: string;
  payment_plans_value: number;
  payment_plans_description: string;
  street: string;
  district: string;
  number: string;
  zipCode?: string;
  cityId?: number;
  city_name?: string;
  state_name?: string;
  quantityOfPaidTransactions: number;
  valueOfPaidTransactions?: number;
  valueOfCashbacks?: number;
  valueOfTotalAmount?: number;
}

const PAID_WITH_TAKEBACK = 3;
const APPROVED = 2;

const HEADERS = [
  "Nome fantasia",
  "Razão social",
  "CNPJ",
  "Email",
  "Telefone",
  "Cadastro",
  "Primeiro acesso",
  "Ramo",
  "Status",
  "Taxa personalizada",
  "Valor da taxa",
  "Plano de mensalidade",
  "Valor da Mensalidade",
];

export class ManagerCompanyReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS);
  }

  protected excelRow(record: ReportResponse) {
    let firstAccess = "";
    if (record.firstAccessAllowedAt != null) {
      firstAccess = new Date(record.firstAccessAllowedAt).toLocaleDateString();
    } else {
      firstAccess = "Não liberado";
    }

    let taxPersonalized = "";
    let tax = 0;
    if (record.customIndustryFeeActive) {
      taxPersonalized = "Ativa";
      tax = parseFloat(record.customIndustryFee);
    } else {
      taxPersonalized = "Inativa";
      tax = parseFloat(record.customIndustryFee) * 100;
    }

    return {
      fantasyName: record.fantasyName,
      corporateName: record.corporateName,
      registeredNumber: maskCNPJ(record.registeredNumber),
      email: record.email,
      phone: record.phone,
      createdAt: new Date(record.createdAt).toLocaleDateString(),
      firstAccess,
      industries_description: record.industries_description,
      company_status_description: record.company_status_description,
      taxPersonalized,
      tax: tax.toFixed(1) + "%",
      payment_plans_description: record.payment_plans_description,
      payment_plans_value: maskCurrency(String(record.payment_plans_value)),
    };
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record));
  }

  public getQuery(dto?: Filter & BaseQueryDto) {
    let cashbackStatus = [APPROVED];
    if (dto.cashbacksStatusIds) {
      cashbackStatus = dto.cashbacksStatusIds.map((item) => Number(item));
    }

    const subqueryPaidTransactions = db
      .count("transactions.id")
      .from("transactions")
      .where("transactions.companiesId", "=", db.ref("companies.id"))
      .whereIn("transactions.transactionStatusId", [
        APPROVED,
        PAID_WITH_TAKEBACK,
      ]);

    const subqueryPaidTransactionValue = db
      .sum("transactions.takebackFeeAmount")
      .from("transactions")
      .where("transactions.companiesId", "=", db.ref("companies.id"))
      .whereIn("transactions.transactionStatusId", [
        APPROVED,
        PAID_WITH_TAKEBACK,
      ]);

    const subqueryCashbackValue = db
      .sum("approvedTransactions.cashbackAmount")
      .from("transactions AS approvedTransactions")
      .where("approvedTransactions.companiesId", "=", db.ref("companies.id"))
      .whereIn("approvedTransactions.transactionStatusId", cashbackStatus);

    const subqueryTotalAmountValue = db
      .sum("approvedTransactions.totalAmount")
      .from("transactions AS approvedTransactions")
      .where("approvedTransactions.companiesId", "=", db.ref("companies.id"))
      .whereIn("approvedTransactions.transactionStatusId", cashbackStatus);

    const query = db
      .select(
        "companies.id",
        "companies.registeredNumber",
        "companies.fantasyName",
        "companies.corporateName",
        "companies.email",
        "companies.phone",
        "companies.firstAccessAllowedAt",
        "companies.createdAt",
        "companies.customIndustryFeeActive",
        "companies.customIndustryFee",
        "companies.positiveBalance",
        db.raw("industries.description AS industries_description"),
        "industries.industryFee",
        db.raw("company_status.description AS company_status_description"),
        db.raw("payment_plans.value AS payment_plans_value"),
        db.raw("payment_plans.description AS payment_plans_description"),
        "companies_address.street",
        "companies_address.district",
        "companies_address.number",
        "companies_address.zipCode",
        "companies_address.cityId",
        db.raw("city.name AS city_name"),
        db.raw("state.name AS state_name"),
        subqueryPaidTransactions.as("quantityOfPaidTransactions"),
        subqueryPaidTransactionValue.as("valueOfPaidTransactions"),
        subqueryCashbackValue.as("valueOfCashbacks"),
        subqueryTotalAmountValue.as("valueOfTotalAmount")
      )
      .from("companies")
      .leftJoin(
        "companies_address",
        "companies_address.id",
        "companies.addressId"
      )
      .leftJoin("city", "city.id", "companies_address.cityId")
      .leftJoin("state", "state.id", "city.stateId")
      .leftJoin("industries", "industries.id", "companies.industryId")
      .leftJoin("company_status", "company_status.id", "companies.statusId")
      .leftJoin("payment_plans", "payment_plans.id", "companies.paymentPlanId");

    if (dto.sort) {
      JSON.parse(dto.sort, (key, value) => {
        if (value === null) {
          return undefined;
        }

        value.length &&
          query.orderBy(OrderByColumn[key], value as "asc" | "desc");
      });
    } else {
      query.orderBy("companies.id", "desc");
    }

    if (dto.industryIds) {
      const industryIds = dto.industryIds.map((item) => Number(item));
      industryIds.length && query.whereIn("industries.id", industryIds);
    }

    if (dto.statusIds) {
      const statusIds = dto.statusIds.map((item) => Number(item));
      statusIds.length && query.whereIn("company_status.id", statusIds);
    }

    if (dto.citiesIds) {
      const citiesIds = dto.citiesIds.map((item) => Number(item));
      citiesIds.length && query.whereIn("companies_address.cityId", citiesIds);
    }

    if (dto.statesIds) {
      const statesIds = dto.statesIds.map((item) => Number(item));
      statesIds.length && query.whereIn("city.stateId", statesIds);
    }

    if (dto.dataActivateStart) {
      const date = new Date(dto.dataActivateStart);
      date.setDate(date.getDate());

      query.andWhere(
        `companies.firstAccessAllowedAt >= '${date.toISOString()}'`
      );
    }

    if (dto.dataActivateEnd) {
      const date = new Date(dto.dataActivateEnd);
      date.setDate(date.getDate() + 1);

      query.where("companies.firstAccessAllowedAt", "<=", date.toISOString());
    }

    if (dto.dataCreatedStart) {
      const date = new Date(dto.dataCreatedStart);
      date.setDate(date.getDate());

      query.where("companies.createdAt", ">=", date.toISOString());
    }

    if (dto.dataCreatedEnd) {
      const date = new Date(dto.dataCreatedEnd);
      date.setDate(date.getDate() + 1);

      query.where("companies.createdAt", "<=", date.toISOString());
    }

    if (dto.company) {
      query.whereLike("companies.fantasyName", `%${dto.company}%`);
      query.orWhereLike("companies.corporateName", `%${dto.company}%`);
      query.orWhereLike(
        "companies.registeredNumber",
        `%${dto.company.replace(/[^\d]/g, "")}%`
      );
    }

    return query;
  }
}
