import {
  BaseFinancialGraphUseCase,
  IMonthlyValue,
} from './BaseFinancialGraphUseCase'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { FinancialReport } from '../../../reports/manager/FinancialReport'
import { FinancialTotalizer } from '../../../controllers/manager/reports/FinancialReportController'

interface TotalizerResponse {
  revenuesValue: number
  expensesValue: number
}
export class FinancialDataUseCase extends BaseFinancialGraphUseCase {
  async getMonthlyValue(
    monthStart: Date,
    monthEnd: Date,
  ): Promise<IMonthlyValue> {
    const totalizer = await this.getTotalizerData(monthStart, monthEnd)
    return {
      revenuesValue: totalizer.revenuesValue,
      expensesValue: totalizer.expensesValue,
    }
  }

  private async getTotalizerData(
    monthStart: Date,
    monthEnd: Date,
  ): Promise<TotalizerResponse> {
    const transactionStatus = await prisma.transactionStatus.findFirst({
      where: {
        description: TransactionStatusEnum.APPROVED,
      },
    })
    const report = new FinancialReport()

    const [totalizer] = await report.getTotalizer<FinancialTotalizer>({
      dateEnd: monthEnd.toISOString(),
      dateStart: monthStart.toISOString(),
      monthlyPayment: 'true',
      transactionStatusId: transactionStatus.id,
    })

    return {
      revenuesValue:
        totalizer.totalTakebackFeeAmount +
        totalizer.companyMonthlyPaymentsAmount +
        totalizer.totalStoreSellValue +
        totalizer.depositFeeValue +
        totalizer.expiredBalances,
      expensesValue:
        totalizer.sellBonusAmount +
        totalizer.newUserBonusAmount +
        totalizer.consultantBonusAmount +
        totalizer.commissionValueAmount +
        totalizer.referralBonusAmount +
        totalizer.totalStoreBuyValue,
    }
  }
}
