import { DateTime } from 'luxon'
import { db } from '../../../knex'

interface FindCompanyConsumersProps {
  companyId: string
}

interface FindIfConsumerBirthdayProps {
  cpf: string
}

export class FindConsumersBirthdaysUseCase {
  async findAllCompanyConsumersBirthdays({
    companyId,
  }: FindCompanyConsumersProps) {
    const currentDate = DateTime.now()

    const birthdays = await this.baseQuery()
      .where('transactions.companiesId', companyId)
      .whereRaw('extract(day from consumers."birthDate") = ?', [
        currentDate.day,
      ])

    return birthdays
  }

  async findIfConsumerBirthday({ cpf }: FindIfConsumerBirthdayProps) {
    const currentDate = DateTime.now()

    const birthday = await this.baseQuery()
      .whereRaw('extract(day from consumers."birthDate") between ? and ?', [
        currentDate.day - 1,
        currentDate.day + 1,
      ])
      .where('consumers.cpf', cpf)

    return birthday[0]
  }

  private baseQuery() {
    const currentDate = DateTime.now()

    const query = db
      .select(
        'consumers.id',
        'consumers.fullName',
        'consumers.phone',
        'consumers.birthDate',
      )
      .from('consumers')
      .join('transactions', 'transactions.consumersId', 'consumers.id')
      .whereRaw('extract(month from consumers."birthDate") = ?', [
        currentDate.month,
      ])
      .groupBy('consumers.id')

    return query
  }
}
