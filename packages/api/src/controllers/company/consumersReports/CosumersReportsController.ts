import { Request, Response } from 'express'
import { ConsumerSexReportUseCase } from './ConsumerSexReportUseCase'
import { ChildrensReportUseCase } from './ChildrensReportUseCase'
import { SchoolingReportUseCase } from './SchoolingReportUseCase'
import { MonthlyIncomesReportUseCase } from './MonthlyIncomesReportUseCase'
import { TimeRangeReportUseCase } from './TimeRangeReportUseCase'
import { ConsumersAverageReportUseCase } from './ConsumersAverageReportUseCase'

export interface Graph {
  labels: string[]
  values: number[]
}

export interface GraphData {
  company: Graph
  city: Graph
}

export interface CosumersReportsResponse {
  companyConsumer: Graph
}

export class CosumersReportsController {
  async index(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const consumerSexReport = new ConsumerSexReportUseCase()
    const consumerChildrensReport = new ChildrensReportUseCase()
    const consumerSchoolingReport = new SchoolingReportUseCase()
    const consumerMonthlyIncomesReport = new MonthlyIncomesReportUseCase()
    const constumerTimeRangeReport = new TimeRangeReportUseCase(companyId)
    const consumersAverageReport = new ConsumersAverageReportUseCase()

    const consumerSex = await consumerSexReport.execute(companyId)
    const consumerChildrens = await consumerChildrensReport.execute(companyId)
    const consumerSchooling = await consumerSchoolingReport.execute(companyId)
    const consumerMonthlyIncomes = await consumerMonthlyIncomesReport.execute(
      companyId,
    )
    const constumerTimeRange = await constumerTimeRangeReport.execute()
    const consumersAverage = await consumersAverageReport.execute(companyId)

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
