/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'

import { BaseQueryDto, BaseReport } from '../BaseReport'
import { db } from '../../knex'
import { parseNumberToExcelString } from '../../utils'

export enum OrderByColumn {
  SELLER_NAME = 'sellerName',
  TOTAL_AMOUNT = 'totalAmount',
  NEW_CLIENTS = 'newClients',
}

interface Filter {
  dateStart?: string
  dateEnd?: string
  office?: number
  transactionStatus?: number
  stateId?: number
  cityId?: number
  companyId?: string
}

interface ReportResponse {
  sellerName: string
  cpf: string
  description: string
  totalAmount: number
  newClients: number
  companyName: string
}

const NEW_USER_BONUS_TYPE = 'NEW_USER'

const HEADERS = [
  'Nome',
  'Cargo',
  'CPF',
  'Empresa',
  'Total em Vendas',
  'Novos Clientes Indicados',
]

export class SellersReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS)
  }

  protected excelRow(record: ReportResponse) {
    return {
      sellerName: record.sellerName,
      description: record.description,
      cpf: record.cpf,
      fantasyName: record.companyName,
      totalAmount: parseNumberToExcelString(record.totalAmount),
      newClients: String(record.newClients),
    }
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record))
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const {
      transactionStatus,
      office,
      dateStart,
      dateEnd,
      cityId,
      companyId,
      stateId,
      orderByColumn = OrderByColumn.SELLER_NAME,
      order = 'asc',
    } = dto ?? {}

    const query = db
      .select(
        'company_users.id',
        'company_users.name as sellerName',
        'company_users.cpf',
        'company_user_types.description',
        'companies.fantasyName as companyName',
        db.raw('sum("totalAmount") as "totalAmount"'),
        db.raw(
          'count("bonus"."transactionId") filter (where "bonus"."type" = ?) as "newClients"',
          [NEW_USER_BONUS_TYPE],
        ),
      )
      .from('company_users')
      .join(
        'company_user_types',
        'company_user_types.id',
        'company_users.companyUserTypesId',
      )
      .join('companies', 'company_users.companyId', 'companies.id')
      .join('companies_address', 'companies.addressId', 'companies_address.id')
      .join('city', 'companies_address.cityId', 'city.id')
      .join('transactions', 'transactions.companyUsersId', 'company_users.id')
      .leftJoin('bonus', 'bonus.transactionId', 'transactions.id')
      .join(
        'transaction_status',
        'transactions.transactionStatusId',
        'transaction_status.id',
      )
      .groupBy(
        'company_users.id',
        'company_user_types.id',
        'companies.fantasyName',
      )
      .orderBy(orderByColumn, order)

    if (dateStart) {
      query.where(
        'transactions.createdAt',
        '>=',
        DateTime.fromISO(dateStart).startOf('day').toString(),
      )
    }

    if (dateEnd) {
      query.where(
        'transactions.createdAt',
        '<=',
        DateTime.fromISO(dateEnd).endOf('day').toString(),
      )
    }

    if (office) {
      query.where('company_user_types.id', office)
    }

    if (transactionStatus) {
      query.where('transaction_status.id', transactionStatus)
    }

    if (cityId) {
      query.where('companies_address.cityId', cityId)
    }

    if (companyId) {
      query.where('companies.id', companyId)
    }

    if (stateId) {
      query.where('city.stateId', stateId)
    }

    return query
  }
}
