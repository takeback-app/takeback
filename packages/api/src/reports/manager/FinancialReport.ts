/* eslint-disable no-unused-vars */
import { DateTime } from 'luxon'

import { BaseQueryDto, BaseReportWithTotalizer } from '../BaseReport'
import { db } from '../../knex'
import { parseNumberToExcelString } from '../../utils'

export enum OrderByColumn {
  TAKEBACK_FEE_VALUE = 'takebackFeeAmount',
  MONTHLY_PAYMENT = 'monthlyPayment',
  CITY_NAME = 'city.name',
}

interface Filter {
  dateStart?: string
  dateEnd?: string
  monthlyPayment?: string
  transactionStatusId?: number
}

interface ReportResponse {
  id: string
  city: string
  takebackFeeAmount: number
  monthlyPayment: number
  storeSellValue: number
  newUserBonus: number
  sellBonus: number
  consultantBonus: number
  referralBonus: number
  storeBuyValue: number
  commissionValue: number
}

const HEADERS = [
  'Cidade',
  'Taxas',
  'Mensalidades',
  'Loja de Ofertas',
  'Grati. por compra',
  'Grati. novo usuário',
  'Grati. represen.',
  'Grati. indicação',
  'Custo Ofertas',
  'Lucro Bruto',
]

export class FinancialReport extends BaseReportWithTotalizer<
  ReportResponse,
  Filter
> {
  constructor() {
    super(HEADERS)
  }

  protected excelRow(record: ReportResponse) {
    return {
      city: record.city,
      takebackFeeAmount: parseNumberToExcelString(record.takebackFeeAmount),
      monthlyPayment: parseNumberToExcelString(record.monthlyPayment),
      storeSellValue: parseNumberToExcelString(record.storeSellValue),
      sellBonus: parseNumberToExcelString(record.sellBonus),
      newUserBonus: parseNumberToExcelString(record.newUserBonus),
      consultantBonus: parseNumberToExcelString(
        record.consultantBonus + record.commissionValue,
      ),
      referralBonus: parseNumberToExcelString(record.referralBonus),
      storeBuyValue: parseNumberToExcelString(record.storeBuyValue),
      totalBalance: parseNumberToExcelString(
        record.takebackFeeAmount +
          record.monthlyPayment +
          record.storeSellValue -
          record.newUserBonus -
          record.sellBonus -
          record.consultantBonus -
          record.commissionValue -
          record.referralBonus -
          record.storeBuyValue,
      ),
    }
  }

  protected pdfRow(record: ReportResponse) {
    return Object.values(this.excelRow(record))
  }

  private getFeeAmountQuery(
    dateStart: string,
    dateEnd: string,
    transactionStatusId: number,
  ) {
    const feeAmountQuery = db
      .select(
        'companies_address.cityId',
        db.raw('sum(transactions."takebackFeeAmount") as "takebackFeeAmount"'),
      )
      .from('transactions')
      .join('companies', 'companies.id', 'transactions.companiesId')
      .join('companies_address', 'companies_address.id', 'companies.addressId')
      .groupBy('companies_address.cityId')
      .as('transactions')

    if (dateStart) {
      feeAmountQuery.where(
        'transactions.createdAt',
        '>=',
        db.raw('?', [dateStart]),
      )
    }

    if (dateEnd) {
      feeAmountQuery.where(
        'transactions.createdAt',
        '<=',
        db.raw('?', [dateEnd]),
      )
    }

    if (transactionStatusId) {
      feeAmountQuery.where(
        'transactions.transactionStatusId',
        '=',
        db.raw('?', [transactionStatusId]),
      )
    }

    return feeAmountQuery
  }

  private getMonthlyPaymentsQuery(
    dateStart: string,
    dateEnd: string,
    monthlyPayment: string,
  ) {
    const monthlyPaymentsQuery = db
      .select(
        'companies_address.cityId',
        db.raw('sum(company_monthly_payment."amountPaid") as "amountPaid"'),
      )
      .from('company_monthly_payment')
      .join('companies', 'companies.id', 'company_monthly_payment.companyId')
      .join('companies_address', 'companies_address.id', 'companies.addressId')
      .groupBy('companies_address.cityId')
      .as('company_monthly_payment')

    if (dateStart) {
      monthlyPaymentsQuery.where(
        'company_monthly_payment.createdAt',
        '>=',
        db.raw('?', [dateStart]),
      )
    }

    if (dateEnd) {
      monthlyPaymentsQuery.where(
        'company_monthly_payment.createdAt',
        '<=',
        db.raw('?', [dateEnd]),
      )
    }

    if (monthlyPayment) {
      monthlyPaymentsQuery.where(
        'company_monthly_payment.isPaid',
        '=',
        db.raw('?', [monthlyPayment]),
      )
    }
    return monthlyPaymentsQuery
  }

  private getBonusQuery(dateStart: string, dateEnd: string) {
    const bonusQuery = db
      .select(
        'consumer_address.cityId',
        db.raw(
          'sum(bonus.value) filter (where bonus."type" = \'SELL\') as "sellBonus"',
        ),
        db.raw(
          'sum(bonus.value) filter (where bonus."type" = \'NEW_USER\') as "newUserBonus"',
        ),
        db.raw(
          'sum(bonus.value) filter (where bonus."type" = \'CONSULTANT\') as "consultantBonus"',
        ),
        db.raw(
          'sum(bonus.value) filter (where bonus."type" = \'REFERRAL\') as "referralBonus"',
        ),
      )
      .from('bonus')
      .join('consumers', 'consumers.id', 'bonus.consumerId')
      .join('consumer_address', 'consumer_address.id', 'consumers.addressId')
      .groupBy('consumer_address.cityId')
      .as('bonus')

    if (dateStart) {
      bonusQuery.where('bonus.createdAt', '>=', db.raw('?', [dateStart]))
    }

    if (dateEnd) {
      bonusQuery.where('bonus.createdAt', '<=', db.raw('?', [dateEnd]))
    }

    return bonusQuery
  }

  private getStoreOrdersQuery(dateStart: string, dateEnd: string) {
    const storeOrdersQuery = db
      .select(
        'companies_address.cityId',
        db.raw('sum(store_orders."value") as "sellValue"'),
        db.raw('sum(store_orders."companyCreditValue") as "buyValue"'),
      )
      .from('store_orders')
      .join(
        'store_products',
        'store_products.id',
        'store_orders.storeProductId',
      )
      .join('companies', 'companies.id', 'store_products.companyId')
      .join('companies_address', 'companies_address.id', 'companies.addressId')
      .groupBy('companies_address.cityId')
      .as('store_orders')

    if (dateStart) {
      storeOrdersQuery.where(
        'store_orders.createdAt',
        '>=',
        db.raw('?', [dateStart]),
      )
    }

    if (dateEnd) {
      storeOrdersQuery.where(
        'store_orders.createdAt',
        '<=',
        db.raw('?', [dateEnd]),
      )
    }

    return storeOrdersQuery
  }

  private getCommissions(dateStart: string, dateEnd: string) {
    const commissionsQuery = db
      .select(
        'representative_addresses.cityId',
        db.raw('sum(commissions."value") as "commissionValue"'),
      )
      .from('commissions')
      .join(
        'representatives',
        'commissions.representativeId',
        'representatives.id',
      )
      .join(
        'representative_addresses',
        'representatives.representativeAddressId',
        'representative_addresses.id',
      )
      .groupBy('representative_addresses.cityId')
      .as('commissions')

    if (dateStart) {
      commissionsQuery.where(
        'commissions.createdAt',
        '>=',
        db.raw('?', [dateStart]),
      )
    }

    if (dateEnd) {
      commissionsQuery.where(
        'commissions.createdAt',
        '<=',
        db.raw('?', [dateEnd]),
      )
    }

    return commissionsQuery
  }

  private baseQuery(dto: Filter & BaseQueryDto) {
    const {
      dateStart,
      dateEnd,
      transactionStatusId,
      monthlyPayment,
      orderByColumn = OrderByColumn.CITY_NAME,
      order = 'asc',
    } = dto ?? {}

    const formatedDateStart = dateStart
      ? DateTime.fromISO(dateStart).startOf('day').toString()
      : undefined

    const formatedDateEnd = dateEnd
      ? DateTime.fromISO(dateEnd).endOf('day').toString()
      : undefined

    const feeAmountQuery = this.getFeeAmountQuery(
      formatedDateStart,
      formatedDateEnd,
      transactionStatusId,
    )

    const monthlyPaymentsQuery = this.getMonthlyPaymentsQuery(
      formatedDateStart,
      formatedDateEnd,
      monthlyPayment,
    )

    const bonusQuery = this.getBonusQuery(formatedDateStart, formatedDateEnd)

    const storeOrdersQuery = this.getStoreOrdersQuery(
      formatedDateStart,
      formatedDateEnd,
    )

    const commissionsQuery = this.getCommissions(
      formatedDateStart,
      formatedDateEnd,
    )
    const query = db
      .from('city')
      .leftJoin(feeAmountQuery, function () {
        this.on('transactions.cityId', '=', 'city.id')
      })
      .leftJoin(monthlyPaymentsQuery, function () {
        this.on('company_monthly_payment.cityId', '=', 'city.id')
      })
      .leftJoin(bonusQuery, function () {
        this.on('bonus.cityId', '=', 'city.id')
      })
      .leftJoin(storeOrdersQuery, function () {
        this.on('store_orders.cityId', '=', 'city.id')
      })
      .leftJoin(commissionsQuery, function () {
        this.on('commissions.cityId', '=', 'city.id')
      })
      .where(function () {
        this.where('takebackFeeAmount', '>', 0)
          .orWhere('amountPaid', '>', 0)
          .orWhere('sellBonus', '>', 0)
          .orWhere('newUserBonus', '>', 0)
          .orWhere('consultantBonus', '>', 0)
          .orWhere('referralBonus', '>', 0)
          .orWhere('buyValue', '>', 0)
          .orWhere('sellValue', '>', 0)
          .orWhere('commissionValue', '>', 0)
      })

    return query
  }

  protected getQuery(dto: Filter & BaseQueryDto) {
    const { orderByColumn = OrderByColumn.CITY_NAME, order = 'asc' } = dto ?? {}

    const query = this.baseQuery(dto)
      .select(
        'city.id',
        'city.name as city',
        db.raw(
          'coalesce(transactions."takebackFeeAmount", 0) as "takebackFeeAmount"',
        ),
        db.raw(
          'coalesce(company_monthly_payment."amountPaid", 0) as "monthlyPayment"',
        ),
        db.raw('coalesce(bonus."sellBonus", 0) as "sellBonus"'),
        db.raw('coalesce(bonus."newUserBonus", 0) as "newUserBonus"'),
        db.raw('coalesce(bonus."consultantBonus", 0) as "consultantBonus"'),
        db.raw('coalesce(bonus."referralBonus", 0) as "referralBonus"'),
        db.raw('coalesce(store_orders."buyValue", 0) as "storeBuyValue"'),
        db.raw('coalesce(store_orders."sellValue", 0) as "storeSellValue"'),
        db.raw(
          'coalesce(commissions."commissionValue", 0) as "commissionValue"',
        ),
      )
      .groupBy(
        'city.id',
        'takebackFeeAmount',
        'amountPaid',
        'sellBonus',
        'newUserBonus',
        'consultantBonus',
        'referralBonus',
        'buyValue',
        'sellValue',
        'commissionValue',
      )
      .orderBy(orderByColumn, order)

    return query
  }

  protected getTotalizerQuery(dto: Filter & BaseQueryDto) {
    const query = this.baseQuery(dto).select(
      db.raw(
        'coalesce(sum(transactions."takebackFeeAmount"), 0) as "totalTakebackFeeAmount"',
      ),
      db.raw(
        'coalesce(sum(company_monthly_payment."amountPaid"), 0) as "companyMonthlyPaymentsAmount"',
      ),
      db.raw('coalesce(sum(bonus."sellBonus"), 0) as "sellBonusAmount"'),
      db.raw('coalesce(sum(bonus."newUserBonus"), 0) as "newUserBonusAmount"'),
      db.raw(
        'coalesce(sum(bonus."consultantBonus"), 0) as "consultantBonusAmount"',
      ),
      db.raw(
        'coalesce(sum(bonus."referralBonus"), 0) as "referralBonusAmount"',
      ),
      db.raw(
        'coalesce(sum(store_orders."buyValue"), 0) as "totalStoreBuyValue"',
      ),
      db.raw(
        'coalesce(sum(store_orders."sellValue"), 0) as "totalStoreSellValue"',
      ),
      db.raw(
        'coalesce(sum(commissions."commissionValue"), 0) as "commissionValueAmount"',
      ),
    )

    return query
  }
}
