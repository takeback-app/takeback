/* eslint-disable no-unused-vars */
import { prisma } from '../../../prisma'
import { db } from '../../../knex'
import { InternalError } from '../../../config/GenerateErros'
import { Graph } from '../../../controllers/company/consumersReports/CosumersReportsController'
import { FilterGraph } from '../../../controllers/manager/consumersReports/CosumersReportsController'

export class TimeRangeReportUseCase {
  private companyId: string
  private stateId: number
  private cityId: number

  async execute({ cityId, companyId, stateId }: FilterGraph): Promise<Graph> {
    this.cityId = cityId
    this.companyId = companyId
    this.stateId = stateId

    const timeRange01_03 = await this.baseQuery(1, 3)
    const timeRange04_06 = await this.baseQuery(4, 6)
    const timeRange07_09 = await this.baseQuery(7, 9)
    const timeRange10_12 = await this.baseQuery(10, 12)
    const timeRange13_15 = await this.baseQuery(13, 15)
    const timeRange16_18 = await this.baseQuery(16, 18)
    const timeRange19_21 = await this.baseQuery(19, 21)
    const timeRange22_00 = await this.baseQuery(22, 0)

    const totalTimeRange =
      timeRange01_03 +
      timeRange04_06 +
      timeRange07_09 +
      timeRange10_12 +
      timeRange13_15 +
      timeRange16_18 +
      timeRange19_21 +
      timeRange22_00

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
      labels,
      values: [
        +(timeRange01_03 / totalTimeRange).toFixed(4),
        +(timeRange04_06 / totalTimeRange).toFixed(4),
        +(timeRange07_09 / totalTimeRange).toFixed(4),
        +(timeRange10_12 / totalTimeRange).toFixed(4),
        +(timeRange13_15 / totalTimeRange).toFixed(4),
        +(timeRange16_18 / totalTimeRange).toFixed(4),
        +(timeRange19_21 / totalTimeRange).toFixed(4),
        +(timeRange22_00 / totalTimeRange).toFixed(4),
      ],
    }
  }

  // converte a hora para UTC-3
  private hourOffset(hour: number) {
    const hourPlusThree = hour + 3
    return hourPlusThree > 24 ? hourPlusThree - 24 : hourPlusThree
  }

  private async baseQuery(startHour: number, endHour: number): Promise<number> {
    const startHourOffset = this.hourOffset(startHour)
    const endHourOffset = this.hourOffset(endHour)

    const companyConsumers = db
      .select('transactions.id')
      .from('consumers')
      .join('transactions', 'transactions.consumersId', 'consumers.id')
      .whereRaw('extract(hour from transactions."createdAt") between ? and ?', [
        startHourOffset,
        endHourOffset,
      ])
      .groupBy('transactions.id', 'consumers.id')

    if (this.stateId) {
      companyConsumers
        .join('companies', 'companies.id', 'transactions.companiesId')
        .join(
          'companies_address',
          'companies_address.id',
          'companies.addressId',
        )
        .join('city', 'city.id', 'companies_address.cityId')
        .where('city.stateId', this.stateId)
    }

    if (this.companyId) {
      companyConsumers.where('transactions.companiesId', this.companyId)
    }
    if (this.cityId) {
      companyConsumers.where('city.id', this.cityId)
    }

    const result = await companyConsumers

    return result.length
  }
}
