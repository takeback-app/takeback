import { Request, Response } from "express";
// import { FindAppDataUseCase } from "./FindAppDataUseCase";

import { ReportCashbackByPeriodUseCase } from "./ReportCashbackByPeriodUseCase";
import { ReportCashbackByPaymentMethodUseCase } from "./ReportCashbackByPaymentMethodUseCase";
import { BillingReportUseCase } from "./BillingReportUseCase";

class ReportsController {
  async dashboardReports(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];

    const cashbacksByPeriodReport = new ReportCashbackByPeriodUseCase();
    const billingReport = new BillingReportUseCase();
    const cashbacksByPaymentMethodsReport =
      new ReportCashbackByPaymentMethodUseCase();

    const cashbacksByPeriod = await cashbacksByPeriodReport.execute({
      companyId,
      userId,
    });

    const cashbacksByMethods = await cashbacksByPaymentMethodsReport.execute({
      companyId,
    });

    const companyAmount = await billingReport.execute({ companyId });

    return response
      .status(200)
      .json({ cashbacksByPeriod, cashbacksByMethods, companyAmount });
  }
}

export { ReportsController };
