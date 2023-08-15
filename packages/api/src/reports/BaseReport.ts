import { Knex, db } from 'knex'
import { Excel } from '../services/files/excel'
import { Pdf } from '../services/files/pdf'

interface PaginationDto {
  page: number
}

export interface BaseQueryDto {
  orderByColumn?: string
  order?: 'asc' | 'desc'
}

export abstract class BaseReport<
  ResultType extends Record<string, any>,
  FilterType extends Record<string, any>,
> {
  protected PER_PAGE = 25

  constructor(protected headers: string[]) {}

  public async getPaginated(
    { page }: PaginationDto,
    filter?: FilterType & BaseQueryDto,
  ) {
    const { data, pagination } = await this.getQuery(filter).paginate({
      currentPage: page,
      perPage: this.PER_PAGE,
      isLengthAware: true,
    })

    return { data, meta: pagination }
  }

  public async getExcel(filter?: FilterType & BaseQueryDto) {
    const queryData = (await this.getQuery(filter)) as ResultType[]

    const rows = queryData.map(this.excelRow)

    return Excel.make()
      .addWorksheet('Relatório de Cliente')
      .setHeading(this.headers)
      .setData(rows)
      .create()
  }

  public async getPdf(filter?: FilterType & BaseQueryDto) {
    const queryData = (await this.getQuery(filter)) as ResultType[]

    const data = queryData.map((record) =>
      this.pdfRow(record).map((value) => ({ text: value, style: 'content' })),
    )

    return Pdf.make({ title: 'Relatório de Cliente' }).create(
      this.headers,
      data,
    )
  }

  protected abstract excelRow(row: ResultType): Record<string, any>
  protected abstract pdfRow(row: ResultType): string[]

  protected abstract getQuery(
    dto?: FilterType & BaseQueryDto,
  ): Knex.QueryBuilder<ResultType, ResultType[]>
}
