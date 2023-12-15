/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'

import { BaseQueryDto, BaseReportWithTotalizer } from '../BaseReport'
import { db } from '../../knex'
import { parseNumberToExcelString } from '../../utils'

export enum OrderByColumn {
  TOTAL_AMOUNT = 'totalAmount',
  CASHBACK_VALUE = 'cashbackAmount',
  TAKEBACK_FEE_VALUE = 'takebackFeeAmount',
  COMPANY_NAME = 'fantasyName',
  POSITIVE_BALANCE = 'positiveBalance',
  LAST_TRANSACTION_DATE = 'lastTransactionDate',
}

export enum TransactionStatusTypes {
  PENDING = 1,
  APPROVED = 2,
  PAID_WITH_TAKEBACK = 3,
  WAITING = 4,
  CANCELED_BY_PARTNER = 5,
  CANCELED_BY_CUSTOMER = 6,
  PROCESSING = 7,
  OVERDUE = 8,
  NOT_PAID_BY_PARTNER = 9,
  TAKEBACK_BONUS = 10,
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
  lastTransactionDate: Date
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
  'Data da Última Transação',
]

export class CompanyReport extends BaseReportWithTotalizer<
  ReportResponse,
  Filter
> {
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
      totalAmount: parseNumberToExcelString(record.totalAmount),
      cashbackAmount: parseNumberToExcelString(record.cashbackAmount),
      takebackFeeAmount: parseNumberToExcelString(record.takebackFeeAmount),
      positiveBalance: parseNumberToExcelString(record.positiveBalance),
      lastTransactionDate: record.lastTransactionDate
        ? DateTime.fromJSDate(record.lastTransactionDate).toFormat('dd/MM/yyyy')
        : '-',
    }
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record))
  }

  private baseQuery(dto: Filter & BaseQueryDto) {
    const {
      dateStart,
      dateEnd,
      stateId,
      cityId,
      companyStatusId,
      transactionStatusId = TransactionStatusTypes.APPROVED,
    } = dto ?? {}
    const query = db
      .from('companies')
      .join('companies_address', 'companies.addressId', 'companies_address.id')
      .join('industries', 'companies.industryId', 'industries.id')
      .join('city', 'companies_address.cityId', 'city.id')
      .join('state', 'city.stateId', 'state.id')
      .join('company_status', 'companies.statusId', 'company_status.id')
      .leftJoin('transactions', function () {
        this.on('companies.id', '=', 'transactions.companiesId')

        if (dateStart) {
          this.andOn(
            'transactions.createdAt',
            '>=',
            db.raw('?', [
              DateTime.fromISO(dateStart).startOf('day').toString(),
            ]),
          )
        }

        if (dateEnd) {
          this.andOn(
            'transactions.createdAt',
            '<=',
            db.raw('?', [DateTime.fromISO(dateEnd).endOf('day').toString()]),
          )
        }

        if (transactionStatusId) {
          this.andOn(
            'transactions.transactionStatusId',
            '=',
            db.raw('?', [transactionStatusId]),
          )
        }
      })
      .groupBy(
        'companies.id',
        'city.id',
        'state.id',
        'industries.description',
        'company_status.description',
      )

    if (cityId) {
      query.where('companies_address.cityId', cityId)
    }

    if (stateId) {
      query.where('city.stateId', stateId)
    }

    if (companyStatusId) {
      query.where('companies.statusId', companyStatusId)
    }

    return query
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const { orderByColumn = OrderByColumn.TOTAL_AMOUNT, order = 'desc' } =
      dto ?? {}
    const query = this.baseQuery(dto).select(
      'companies.id as id',
      'companies.fantasyName as companyName',
      'companies.registeredNumber',
      'city.name as city',
      'state.name as state',
      'company_status.description as status',
      'industries.description as industry',
      db.raw('coalesce(sum("totalAmount"), 0) as "totalAmount"'),
      db.raw('coalesce(sum("cashbackAmount"), 0) as "cashbackAmount"'),
      db.raw('coalesce(sum("takebackFeeAmount"), 0) as "takebackFeeAmount"'),
      'companies.positiveBalance',
      db.raw('max(transactions."createdAt") as "lastTransactionDate"'),
    )

    if (orderByColumn === OrderByColumn.LAST_TRANSACTION_DATE) {
      query.orderByRaw(`max(transactions."createdAt") ${order} NULLS LAST`)

      return query
    }

    query.orderBy(orderByColumn, order)

    return query
  }

  protected getTotalizerQuery(dto: Filter & BaseQueryDto) {
    const query = this.baseQuery(dto).select(
      db.raw('count(DISTINCT companies."id") as "companiesCount"'),
      db.raw('coalesce(sum("totalAmount"), 0) as "totalAmount"'),
      db.raw('coalesce(sum("cashbackAmount"), 0) as "totalCashbackAmount"'),
      db.raw(
        'coalesce(sum("takebackFeeAmount"), 0) as "totalTakebackFeeAmount"',
      ),
      db.raw('companies."positiveBalance" as "totalPositiveBalances"'),
    )

    return query
  }
}
