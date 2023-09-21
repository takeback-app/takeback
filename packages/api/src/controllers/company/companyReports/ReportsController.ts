import { Request, Response } from 'express'
// import { FindAppDataUseCase } from "./FindAppDataUseCase";

import { ReportCashbackByPeriodUseCase } from './ReportCashbackByPeriodUseCase'
import { BillingReportUseCase } from './BillingReportUseCase'
import { ReportBillingByPeriodUseCase } from './ReportBillingByPeriodUseCase'

class ReportsController {
  async dashboardReports(request: Request, response: Response) {
    const { companyId } = request['tokenPayload']

    const cashbacksByPeriodReport = new ReportCashbackByPeriodUseCase()
    const billingReport = new BillingReportUseCase()
    const billingsByPeriodReport = new ReportBillingByPeriodUseCase()

    const cashbacksByPeriod = await cashbacksByPeriodReport.execute(
      6,
      companyId,
    )

    const billingsByPeriod = await billingsByPeriodReport.execute(6, companyId)

    const companyAmount = await billingReport.execute({ companyId })

    return response
      .status(200)
      .json({ cashbacksByPeriod, billingsByPeriod, companyAmount })
  }
}

export { ReportsController }
