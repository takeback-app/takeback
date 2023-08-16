/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'

import { BaseQueryDto, BaseReport } from '../BaseReport'
import { db } from '../../knex'
import { currency, maskPhone } from '../../utils/Masks'

export enum OrderByColumn {
  TOTAL_AMOUNT = 'totalAmount',
  CASHBACK_VALUE = 'cashbackAmount',
  TAKEBACK_FEE_VALUE = 'takebackFeeAmount',
  COMPANY_NAME = 'fantasyName',
  POSITIVE_BALANCE = 'positiveBalance',
}

interface Filter {
  dateStart?: string
  dateEnd?: string
  stateId?: number
  cityId?: number
  companyStatusId?: number
  transactionStatusId?: number
}

interface ReportResponse {
  id: string
  companyName: string
  registeredNumber: string
  city: string
  state: string
  status: string
  industry: string
  totalAmount: number
  cashbackAmount: number
  takebackFeeAmount: number
  positiveBalance: number
}

const HEADERS = [
  'Empresa',
  'CNPJ',
  'Cidade',
  'Estado',
  'Status',
  'Ramo de atividade',
  'Total de faturamento',
  'Total de Cashbacks',
  'Taxas',
  'Saldo Atual',
]

export class CompanyReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS)
  }

  protected excelRow(record: ReportResponse) {
    return {
      companyName: record.companyName,
      registeredNumber: record.registeredNumber,
      city: record.city,
      state: record.state,
      status: record.status,
      industry: record.industry,
      totalAmount: currency(record.totalAmount),
      cashbackAmount: currency(record.cashbackAmount),
      takebackFeeAmount: currency(record.takebackFeeAmount),
      positiveBalance: currency(record.positiveBalance),
    }
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record))
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const {
      dateStart,
      dateEnd,
      stateId,
      cityId,
      companyStatusId,
      transactionStatusId,
      orderByColumn = OrderByColumn.COMPANY_NAME,
      order = 'asc',
    } = dto ?? {}
    const query = db
      .select(
        'companies.id as id',
        'companies.fantasyName as companyName',
        'companies.registeredNumber',
        'city.name as city',
        'state.name as state',
        'transaction_status.description as status',
        'industries.description as industry',
        db.raw('sum("totalAmount") as "totalAmount"'),
        db.raw('sum("cashbackAmount") as "cashbackAmount"'),
        db.raw('sum("takebackFeeAmount") as "takebackFeeAmount"'),
        'companies.positiveBalance',
      )
      .from('companies')
      .join('companies_address', 'companies.addressId', 'companies_address.id')
      .join('industries', 'companies.industryId', 'industries.id')
      .join('city', 'companies_address.cityId', 'city.id')
      .join('state', 'city.stateId', 'state.id')
      .join('transactions', 'companies.id', 'transactions.companiesId')
      .join(
        'transaction_status',
        'transactions.transactionStatusId',
        'transaction_status.id',
      )
      .groupBy(
        'companies.id',
        'city.id',
        'state.id',
        'transaction_status.description',
        'industries.description',
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
        DateTime.fromISO(dateEnd).startOf('day').toString(),
      )
    }

    if (cityId) {
      query.where('consumer_address.cityId', cityId)
    }

    if (stateId) {
      query.where('city.stateId', stateId)
    }

    if (companyStatusId) {
      query.where('companies.statusId', companyStatusId)
    }

    if (transactionStatusId) {
      query.where('transaction.transactionStatusId', transactionStatusId)
    }

    return query
  }
}
