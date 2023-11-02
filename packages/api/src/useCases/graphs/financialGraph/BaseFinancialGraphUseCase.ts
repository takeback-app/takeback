import { DateTime, Interval } from 'luxon'

export interface IMonthlyValue {
  revenuesValue: number
  expensesValue: number
}

export abstract class BaseFinancialGraphUseCase {
  async execute(numOfMonths = 12, ...args: any[]) {
    const interval =
      numOfMonths >= 0
        ? Interval.fromDateTimes(
            DateTime.now().startOf('month').minus({ months: numOfMonths }),
            DateTime.now().endOf('day'),
          )
        : Interval.fromDateTimes(
            DateTime.now().startOf('month'),
            DateTime.now()
              .endOf('month')
              .plus({ months: numOfMonths * -1 }),
          )

    const months = interval
      .splitBy({ month: 1 })
      .map((month: Interval) => [month.start, month.end])

    const labels: string[] = []
    const revenues: number[] = []
    const expenses: number[] = []

    for (const [monthStart, monthEnd] of months) {
      const value = await this.getMonthlyValue(
        monthStart.toJSDate(),
        monthEnd.toJSDate(),
        ...args,
      )

      labels.push(
        monthStart.setLocale('pt').toFormat('LLLL yyyy').toUpperCase(),
      )
      revenues.push(value.revenuesValue)
      expenses.push(value.expensesValue)
    }

    return { revenues, expenses, labels }
  }

  abstract getMonthlyValue(
    monthStart: Date,
    monthEnd: Date,
    ...args: any[]
  ): Promise<IMonthlyValue>
}
