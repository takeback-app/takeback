import { getRepository } from 'typeorm'
import { City } from '../../../database/models/City'
import { Companies } from '../../../database/models/Company'
import { CompaniesAddress } from '../../../database/models/CompanyAddress'
import { CompanyStatus } from '../../../database/models/CompanyStatus'
import { Industries } from '../../../database/models/Industry'

interface Props {
  filters?: {
    statusId?: string
    industryId?: string
    cityId?: string
    monthlyPayment?: string
    company?: string
    limit?: string
    offset?: string
  }
}

class FindCompaniesUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(Companies)
      .createQueryBuilder('company')
      .select([
        'company.id',
        'company.registeredNumber',
        'company.fantasyName',
        'company.createdAt',
        'company.currentMonthlyPaymentPaid',
        'company.periodFree',
        'company.firstAccessAllowedAt',
      ])
      .addSelect(['industry.description', 'status.description', 'city.name'])
      .leftJoin(Industries, 'industry', 'industry.id = company.industry')
      .leftJoin(CompanyStatus, 'status', 'status.id = company.status')
      .leftJoin(CompaniesAddress, 'address', 'address.id = company.address')
      .leftJoin(City, 'city', 'city.id = address.city')
      .limit(filters.limit ? parseInt(filters.limit) : 30)
      .offset(
        filters.offset ? parseInt(filters.offset) * parseInt(filters.limit) : 0,
      )
      .orderBy(
        'CASE ' +
          'WHEN company.status IN (8, 7) THEN 1 ' +
          'WHEN company.status = 1 THEN 2 ' +
          'WHEN company.status = 10 THEN 3 ' +
          'ELSE 4 ' +
          'END',
      )
      .addOrderBy('company.fantasyName', 'ASC')

    if (filters.industryId) {
      query.where('industry.id = :industryId', {
        industryId: filters.industryId,
      })
    }

    if (filters.statusId) {
      query.andWhere('status.id = :statusId', { statusId: filters.statusId })
    }

    if (filters.cityId) {
      query.andWhere('city.id = :cityId', { cityId: filters.cityId })
    }

    if (filters.monthlyPayment) {
      query.andWhere('company.currentMonthlyPaymentPaid = :monthlyPayment', {
        monthlyPayment: filters.monthlyPayment === 'true',
      })
    }

    if (
      filters.company &&
      filters.company !== undefined &&
      filters.company !== null
    ) {
      query.andWhere('company.fantasyName ILIKE :fantasyName', {
        fantasyName: `%${filters.company}%`,
      })

      query.orWhere('company.corporateName ILIKE :corporateName', {
        corporateName: `%${filters.company}%`,
      })

      query.orWhere('company.registeredNumber ILIKE :registeredNumber', {
        registeredNumber: `%${filters.company}%`,
      })
    }

    const companies = await query.getRawMany()

    return companies
  }
}

export { FindCompaniesUseCase }
