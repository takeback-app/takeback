/* eslint-disable no-unused-vars */
import { Prisma } from '@prisma/client'
import { DateTime } from 'luxon'
import { Graph, GraphData } from './CosumersReportsController'
import { BaseConsumersGraphUseCase } from './BaseConsumersGraphUseCase'
import { prisma } from '../../../prisma'
import { db } from '../../../knex'
import { InternalError } from '../../../config/GenerateErros'

interface baseQueryResponse {
  company: number
  city: number
}

export class TimeRangeReportUseCase {
  cityId: number

  constructor(protected companyId: string) {}

  async execute(): Promise<GraphData> {
    const company = await prisma.company.findUnique({
      where: { id: this.companyId },
      include: { companyAddress: { select: { cityId: true } } },
    })

    if (!company) {
      throw new InternalError('Empresa não localizada', 404)
    }

    this.cityId = company.companyAddress.cityId

    const timeRange01_03 = await this.baseQuery(4, 6)
    const timeRange04_06 = await this.baseQuery(7, 9)
    const timeRange07_09 = await this.baseQuery(10, 12)
    const timeRange10_12 = await this.baseQuery(13, 15)
    const timeRange13_15 = await this.baseQuery(16, 18)
    const timeRange16_18 = await this.baseQuery(19, 21)
    const timeRange19_21 = await this.baseQuery(22, 0)
    const timeRange22_00 = await this.baseQuery(1, 3)

    const labels = [
      'Entre 01:00hrs e 03:59hrs',
      'Entre 04:00hrs e 06:59hrs',
      'Entre 07:00hrs e 09:59hrs',
      'Entre 10:00hrs e 12:59hrs',
      'Entre 13:00hrs e 15:59hrs',
      'Entre 16:00hrs e 18:59hrs',
      'Entre 19:00hrs e 21:59hrs',
      'Entre 22:00hrs e 00:59hrs',
    ]

    return {
      company: {
        labels,
        values: [
          timeRange01_03.company,
          timeRange04_06.company,
          timeRange07_09.company,
          timeRange10_12.company,
          timeRange13_15.company,
          timeRange16_18.company,
          timeRange19_21.company,
          timeRange22_00.company,
        ],
      },
      city: {
        labels,
        values: [
          timeRange01_03.city,
          timeRange04_06.city,
          timeRange07_09.city,
          timeRange10_12.city,
          timeRange13_15.city,
          timeRange16_18.city,
          timeRange19_21.city,
          timeRange22_00.city,
        ],
      },
    }
  }

  private async baseQuery(
    startHour: number,
    endHour: number,
  ): Promise<baseQueryResponse> {
    const companyConsumers = await db
      .select('transactions.id')
      .from('consumers')
      .join('transactions', 'transactions.consumersId', 'consumers.id')
      .where('transactions.companiesId', this.companyId)
      .whereRaw('extract(hour from transactions."createdAt") between ? and ?', [
        startHour,
        endHour,
      ])
      .groupBy('transactions.id', 'consumers.id')

    const cityConsumers = await db
      .select('transactions.id')
      .from('consumers')
      .join('transactions', 'transactions.consumersId', 'consumers.id')
      .join('companies', 'companies.id', 'transactions.companiesId')
      .join('companies_address', 'companies_address.id', 'companies.addressId')
      .where('companies_address.cityId', this.cityId)
      .whereRaw('extract(hour from transactions."createdAt") between ? and ?', [
        startHour,
        endHour,
      ])
      .groupBy('transactions.id', 'consumers.id')

    return {
      company: companyConsumers.length,
      city: cityConsumers.length,
    }
  }
}
