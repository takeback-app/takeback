import { DateTime, Interval } from "luxon";

export abstract class BaseGraphUseCase {
  async execute(numOfMonths = 12, ...args: any[]) {
    const interval =
      numOfMonths >= 0
        ? Interval.fromDateTimes(
            DateTime.now().startOf("month").minus({ months: numOfMonths }),
            DateTime.now().endOf("day")
          )
        : Interval.fromDateTimes(
            DateTime.now().startOf("month"),
            DateTime.now()
              .endOf("month")
              .plus({ months: numOfMonths * -1 })
          );

    const months = interval
      .splitBy({ month: 1 })
      .map((month: Interval) => [month.start, month.end]);

    const labels: string[] = [];
    const values: number[] = [];

    for (const [monthStart, monthEnd] of months) {
      const value = await this.getMonthlyValue(
        monthStart.toJSDate(),
        monthEnd.toJSDate(),
        ...args
      );

      labels.push(
        monthStart.setLocale("pt").toFormat("LLLL yyyy").toUpperCase()
      );
      values.push(value);
    }

    return { values, labels };
  }

  abstract getMonthlyValue(
    monthStart: Date,
    monthEnd: Date,
    ...args: any[]
  ): Promise<number>;
}
