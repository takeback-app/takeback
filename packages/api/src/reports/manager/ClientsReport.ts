/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'

import { BaseQueryDto, BaseReport } from '../BaseReport'
import { db } from '../../knex'
import { currency, maskPhone } from '../../utils/Masks'

export enum OrderByColumn {
  FULL_NAME = 'consumers.fullName',
  TOTAL_AMOUNT = 'totalAmount',
  CASHBACK_APPROVED = 'cashbackApproved',
  TRANSACTION_COUNT = 'transactionCount',
}

interface Filter {
  dateStart?: string
  dateEnd?: string
  stateId?: number
  cityId?: number
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
}

const APPROVED_TRANSACTION_STATUS_ID = 2

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
]

export class ClientsReport extends BaseReport<ReportResponse, Filter> {
  constructor() {
    super(HEADERS)
  }

  protected excelRow(record: ReportResponse) {
    return {
      fullName: record.fullName,
      phone: record.phone.trim() ? maskPhone(record.phone) : '-',
      cpf: record.cpf,
      city: record.city,
      state: record.state,
      totalAmount: currency(record.totalAmount),
      cashbackApproved: currency(record.cashbackApproved),
      balance: currency(record.balance),
      blockedBalance: currency(record.blockedBalance),
      lastTransactionDate: DateTime.fromJSDate(
        record.lastTransactionDate,
      ).toFormat('dd/MM/yyyy'),
    }
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record))
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const {
      dateEnd,
      dateStart,
      cityId,
      stateId,
      orderByColumn = OrderByColumn.FULL_NAME,
      order = 'asc',
    } = dto ?? {}
    const query = db
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
      )
      .from('consumers')
      .join('consumer_address', 'consumers.addressId', 'consumer_address.id')
      .join('city', 'consumer_address.cityId', 'city.id')
      .join('state', 'city.stateId', 'state.id')
      .join('transactions', 'consumers.id', 'transactions.consumersId')
      .groupBy('consumers.id', 'city.id', 'state.id')
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

    return query
  }
}
