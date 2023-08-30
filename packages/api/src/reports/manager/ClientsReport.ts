/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'

import { BaseQueryDto, BaseReport } from '../BaseReport'
import { db } from '../../knex'
import { maskPhone } from '../../utils/Masks'
import { parseNumberToExcelString } from '../../utils'

export enum OrderByColumn {
  TOTAL_AMOUNT = 'totalAmount',
  FULL_NAME = 'consumers.fullName',
  CASHBACK_APPROVED = 'cashbackApproved',
  BALANCE = 'balance',
  BLOCKED_BALANCE = 'blockedBalance',
}

interface Filter {
  dateStart?: string
  dateEnd?: string
  stateId?: number
  cityId?: number
  haveTransactions: boolean
  isPlaceholder?: boolean
}

interface ReportResponse {
  id: string
  fullName: string
  cpf: string
  phone: string
  city: string
  state: string
  totalAmount: number
  cashbackApproved: number
  balance: number
  blockedBalance: number
  lastTransactionDate: Date
  createdAt: Date
}

export const APPROVED_TRANSACTION_STATUS_ID = 2

const HEADERS = [
  'Nome',
  'Telefone',
  'CPF',
  'Cidade',
  'Estado',
  'Total de Compras',
  'Total de Cashback Ganho',
  'Saldo Pendente',
  'Saldo Atual',
  'Data da Última Transação',
  'Data de Cadastro',
]

export class ClientsReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS)
  }

  protected excelRow(record: ReportResponse) {
    return {
      fullName: record.fullName,
      phone: record.phone?.trim() ? maskPhone(record.phone) : '-',
      cpf: record.cpf,
      city: record.city ?? '-',
      state: record.state ?? '-',
      totalAmount: parseNumberToExcelString(record.totalAmount),
      cashbackApproved: parseNumberToExcelString(record.cashbackApproved),
      blockedBalance: parseNumberToExcelString(record.blockedBalance),
      balance: parseNumberToExcelString(record.balance),
      lastTransactionDate: record.lastTransactionDate
        ? DateTime.fromJSDate(record.lastTransactionDate).toFormat('dd/MM/yyyy')
        : '-',
      createdAt: DateTime.fromJSDate(record.createdAt).toFormat('dd/MM/yyyy'),
    }
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record))
  }

  private baseQuery(dto: Filter & BaseQueryDto) {
    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      haveTransactions,
      isPlaceholder,
    } = dto ?? {}
    const query = db
      .from('consumers')
      .leftJoin(
        'consumer_address',
        'consumers.addressId',
        'consumer_address.id',
      )
      .leftJoin('city', 'consumer_address.cityId', 'city.id')
      .leftJoin('state', 'city.stateId', 'state.id')
      .leftJoin('transactions', 'consumers.id', 'transactions.consumersId')

    if (isPlaceholder === true) {
      query.whereNull('consumers.addressId')
      query.where('consumers.isPlaceholderConsumer', '=', true)
    }
    if (isPlaceholder === false) {
      query.whereNotNull('consumers.addressId')
      query.where('consumers.isPlaceholderConsumer', '=', false)
    }

    if (haveTransactions) {
      query.whereNotNull('transactions.id')
    }

    if (haveTransactions && dateStart) {
      query.where(
        'transactions.createdAt',
        '>=',
        DateTime.fromISO(dateStart)
          .minus({ hours: 3 })
          .startOf('day')
          .toJSDate(),
      )
    }

    if (haveTransactions && dateEnd) {
      query.where(
        'transactions.createdAt',
        '<=',
        DateTime.fromISO(dateEnd).minus({ hours: 3 }).endOf('day').toJSDate(),
      )
    }
    if (!haveTransactions) {
      query.whereNull('transactions.id')
    }

    if (!haveTransactions && dateStart) {
      query.where(
        'consumers.createdAt',
        '>=',
        DateTime.fromISO(dateStart)
          .minus({ hours: 3 })
          .startOf('day')
          .toJSDate(),
      )
    }

    if (!haveTransactions && dateEnd) {
      query.where(
        'consumers.createdAt',
        '<=',
        DateTime.fromISO(dateEnd).minus({ hours: 3 }).endOf('day').toJSDate(),
      )
    }

    if (cityId) {
      query.where('consumer_address.cityId', cityId)
    }

    if (stateId) {
      query.where('city.stateId', stateId)
    }

    return query
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const { orderByColumn = OrderByColumn.FULL_NAME, order = 'asc' } = dto ?? {}
    const query = this.baseQuery(dto)
      .select(
        'consumers.id as id',
        'fullName',
        'phone',
        'cpf',
        'city.name as city',
        'state.name as state',
        db.raw('sum("totalAmount") as "totalAmount"'),
        db.raw(
          'sum(case when transactions."transactionStatusId" = ? then transactions."cashbackAmount" else 0 end) as "cashbackApproved"',
          [APPROVED_TRANSACTION_STATUS_ID],
        ),
        'blockedBalance',
        'balance',
        db.raw('max(transactions."createdAt") as "lastTransactionDate"'),
        'consumers.createdAt',
      )
      .groupBy('consumers.id', 'city.id', 'state.id')
      .orderBy(orderByColumn, order)

    return query
  }

  protected getTotalizerQuery(dto: Filter & BaseQueryDto) {
    const query = this.baseQuery(dto)
      .select(
        db.raw('count(DISTINCT consumers."id") as "consumerCount"'),
        db.raw('sum("totalAmount") as "totalShoppingValue"'),
        db.raw(
          'sum(case when transactions."transactionStatusId" = ? then transactions."cashbackAmount" else 0 end) as "totalApprovedCashback"',
          [APPROVED_TRANSACTION_STATUS_ID],
        ),
        'blockedBalance as pendingAmount',
        'balance as balanceAmount',
      )
      .groupBy('consumers.id')

    return query
  }
}
