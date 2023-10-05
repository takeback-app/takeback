import { Request, Response } from 'express'
import { z } from 'zod'
import { ConsumersAverageReportUseCase } from './../../../useCases/manager/consumersReports/ConsumersAverageReportUseCase'
import { TimeRangeReportUseCase } from './../../../useCases/manager/consumersReports/TimeRangeReportUseCase'
import { MonthlyIncomesReportUseCase } from './../../../useCases/manager/consumersReports/MonthlyIncomesReportUseCase'
import { SchoolingReportUseCase } from './../../../useCases/manager/consumersReports/SchoolingReportUseCase'
import { ChildrensReportUseCase } from './../../../useCases/manager/consumersReports/ChildrensReportUseCase'
import { ConsumerSexReportUseCase } from './../../../useCases/manager/consumersReports/ConsumerSexReportUseCase'
import { InternalError } from '../../../config/GenerateErros'
import { filterNumber } from '../../../utils'

export interface Graph {
  labels: string[]
  values: number[]
}

export interface CosumersReportsResponse {
  companyConsumer: Graph
}

export interface FilterGraph {
  companyId?: string
  cityId?: number
  stateId?: number
}

const CosumersReportsRequest = z
  .object({
    cityId: z.string().optional(),
    companyId: z.string().optional(),
    stateId: z.string().optional(),
  })
  .strict()

export class CosumersProfileReportsController {
  async index(request: Request, response: Response) {
    const form = CosumersReportsRequest.safeParse(request.query)

    if (!form.success) {
      throw new InternalError('Existem erros nos filtros', 400)
    }

    const filter = {
      cityId: filterNumber(form.data.cityId),
      companyId: form.data.companyId,
      stateId: filterNumber(form.data.stateId),
    }

    const consumerSexReport = new ConsumerSexReportUseCase()
    const consumerChildrensReport = new ChildrensReportUseCase()
    const consumerSchoolingReport = new SchoolingReportUseCase()
    const consumerMonthlyIncomesReport = new MonthlyIncomesReportUseCase()
    const constumerTimeRangeReport = new TimeRangeReportUseCase()
    const consumersAverageReport = new ConsumersAverageReportUseCase()

    const consumerSex = await consumerSexReport.execute(filter)
    const consumerChildrens = await consumerChildrensReport.execute(filter)
    const consumerSchooling = await consumerSchoolingReport.execute(filter)
    const consumerMonthlyIncomes = await consumerMonthlyIncomesReport.execute(
      filter,
    )
    const constumerTimeRange = await constumerTimeRangeReport.execute(filter)
    const consumersAverage = await consumersAverageReport.execute(filter)

    return response.status(200).json({
      consumerSex,
      consumerChildrens,
      consumerSchooling,
      consumerMonthlyIncomes,
      constumerTimeRange,
      consumersAverage,
    })
  }
}
