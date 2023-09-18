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
    const birthdays = await this.baseQuery().where(
      'transactions.companiesId',
      companyId,
    )

    return birthdays
  }

  async findIfConsumerBirthday({ cpf }: FindIfConsumerBirthdayProps) {
    const birthday = await this.baseQuery().where('consumers.cpf', cpf)
    return birthday[0]
  }

  private baseQuery() {
    const currentDate = DateTime.now()

    const query = db
      .select('consumers.id', 'consumers.fullName', 'consumers.phone')
      .from('consumers')
      .join('transactions', 'transactions.consumersId', 'consumers.id')
      .whereRaw('extract(month from consumers."birthDate") = ?', [
        currentDate.month,
      ])
      .whereRaw('extract(day from consumers."birthDate") = ?', [
        currentDate.day,
      ])
      .groupBy('consumers.id')

    return query
  }
}
