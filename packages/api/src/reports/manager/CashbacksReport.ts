/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'
import { BaseQueryDto, BaseReportWithTotalizer } from '../BaseReport'
import { db } from '../../knex'
import { parseNumberToExcelString } from '../../utils'

export enum OrderByColumn {
  TOTAL_AMOUNT = 'totalAmount',
  CASHBACK_VALUE = 'cashbackAmount',
  TAKEBACK_FEE_VALUE = 'takebackFeeAmount',
  DATE = 'createdAt',
}

interface Filter {
  dateStart?: string
  dateEnd?: string
  stateId?: number
  cityId?: number
  companyStatusId?: number
  companyId?: string
  companyUserId?: string
  transactionStatusId?: number
  paymentMethodId?: number
}

interface ReportResponse {
  id: number
  totalAmount: number
  cashbackAmount: number
  takebackFeeAmount: number
  backAmount: number
  createdAt: Date
  fullName: string
  companyName: string
  companyUserName: string | null
  status: string
  paymentMethod: string
  isTakebackMethod: boolean
}

const HEADERS = [
  'Ordem',
  'Nome',
  'Empresa',
  'Status',
  'Forma de Pagamento',
  'Vendedor',
  'Valor da Compra',
  'Taxa Takeback',
  'Cashback',
  'Troco',
  'Valor a Pagar',
  'Data da Emissão',
]

export class CashbacksReport extends BaseReportWithTotalizer<
  ReportResponse,
  Filter
> {
  constructor() {
    super(HEADERS)
  }

  protected excelRow(record: ReportResponse) {
    return {
      id: String(record.id),
      fullName: record.fullName,
      companyName: record.companyName,
      status: record.status,
      paymentMethod: record.paymentMethod,
      companyUserName: record.companyUserName,
      totalAmount: parseNumberToExcelString(record.totalAmount),
      takebackFeeAmount: parseNumberToExcelString(record.takebackFeeAmount),
      cashbackAmount: parseNumberToExcelString(record.cashbackAmount),
      backAmount: parseNumberToExcelString(record.backAmount),
      companyTotalPay: parseNumberToExcelString(
        record.cashbackAmount + record.takebackFeeAmount + record.backAmount,
      ),
      createdAt: DateTime.fromJSDate(record.createdAt).toFormat('dd/MM/yyyy'),
    }
  }

  protected pdfRow(record: ReportResponse) {
    const excelRow = this.excelRow(record)

    return Object.values(excelRow).map((value) => String(value))
  }

  private baseQuery(dto: Filter & BaseQueryDto) {
    const {
      dateStart,
      dateEnd,
      cityId,
      companyId,
      companyStatusId,
      companyUserId,
      stateId,
      transactionStatusId,
      paymentMethodId,
    } = dto

    const query = db
      .from('transactions')
      .join('consumers', 'transactions.consumersId', 'consumers.id')
      .join('companies', 'transactions.companiesId', 'companies.id')
      .join('companies_address', 'companies.addressId', 'companies_address.id')
      .join('city', 'companies_address.cityId', 'city.id')
      .leftJoin(
        'company_users',
        'transactions.companyUsersId',
        'company_users.id',
      )
      .join(
        'transaction_status',
        'transactions.transactionStatusId',
        'transaction_status.id',
      )
      .join(
        'transaction_payment_methods',
        'transactions.id',
        'transaction_payment_methods.transactionsId',
      )
      .join(
        'company_payment_methods',
        'transaction_payment_methods.paymentMethodId',
        'company_payment_methods.id',
      )
      .join(
        'payment_methods',
        'company_payment_methods.paymentMethodId',
        'payment_methods.id',
      )
      .groupBy(
        'transactions.id',
        'transaction_payment_methods.transactionsId',
        'transaction_status.id',
        'consumers.id',
        'companies.id',
        'company_users.id',
      )

    if (dateStart) {
      query.where(
        'transactions.createdAt',
        '>=',
        db.raw('?', [DateTime.fromISO(dateStart).startOf('day').toJSDate()]),
      )
    }

    if (dateEnd) {
      query.where(
        'transactions.createdAt',
        '<=',
        db.raw('?', [DateTime.fromISO(dateEnd).endOf('day').toJSDate()]),
      )
    }

    if (cityId) {
      query.where('companies_address.cityId', cityId)
    }

    if (companyId) {
      query.where('companies.id', companyId)
    }

    if (companyStatusId) {
      query.where('companies.statusId', companyStatusId)
    }

    if (companyUserId) {
      query.where('company_users.id', companyUserId)
    }

    if (stateId) {
      query.where('city.stateId', stateId)
    }

    if (transactionStatusId) {
      query.where('transaction.transactionStatusId', transactionStatusId)
    }

    if (paymentMethodId) {
      query.where('payment_methods.id', paymentMethodId)
    }

    return query
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const { orderByColumn = OrderByColumn.TOTAL_AMOUNT, order = 'asc' } = dto

    const query = this.baseQuery(dto)
      .select(
        'transactions.id',
        'transactions.totalAmount',
        'transactions.cashbackAmount',
        'transactions.takebackFeeAmount',
        'transactions.backAmount',
        'transactions.createdAt',
        'consumers.fullName',
        'companies.fantasyName as companyName',
        'company_users.name as companyUserName',
        'transaction_status.description as status',
        'transactions.transactionSource',
        db.raw('max(payment_methods.description) as "paymentMethod"'),
      )
      .orderBy(orderByColumn, order)

    return query
  }

  protected getTotalizerQuery(dto: Filter & BaseQueryDto) {
    const query = this.baseQuery(dto).select(
      db.raw('count(DISTINCT transactions."id") as "totalCashbackCount"'),
      db.raw('transactions."totalAmount" as "totalAmount"'),
      db.raw('transactions."cashbackAmount" as "totalCashbackAmount"'),
      db.raw('transactions."takebackFeeAmount" as "totalTakebackFeeAmount"'),
      db.raw('transactions."backAmount" as "totalBackAmount"'),
    )

    return query
  }
}
