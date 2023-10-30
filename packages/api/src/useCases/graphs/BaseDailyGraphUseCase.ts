import { DateTime, Interval } from 'luxon'

export abstract class BaseDailyGraphUseCase {
  async execute(numOfDays = 30, ...args: any[]) {
    const interval =
      numOfDays >= 0
        ? Interval.fromDateTimes(
            DateTime.now()
              .startOf('day')
              .minus({ days: numOfDays - 1 }),
            DateTime.now().endOf('day'),
          )
        : Interval.fromDateTimes(
            DateTime.now().startOf('day'),
            DateTime.now()
              .endOf('day')
              .plus({ days: numOfDays * -1 }),
          )

    const days = interval
      .splitBy({ day: 1 })
      .map((day: Interval) => [day.start, day.end])

    const labels: string[] = []
    const values: number[] = []

    for (const [dayStart, dayEnd] of days) {
      const value = await this.getDailyValue(
        dayStart.toJSDate(),
        dayEnd.toJSDate(),
        ...args,
      )

      labels.push(dayStart.setLocale('pt').toFormat('dd').toUpperCase())
      values.push(value)
    }

    return { values, labels }
  }

  abstract getDailyValue(
    dayStart: Date,
    dayEnd: Date,
    ...args: any[]
  ): Promise<number>
}
