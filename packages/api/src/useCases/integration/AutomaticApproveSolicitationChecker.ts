import { TransactionSolicitation } from '@prisma/client'
import { prisma } from '../../prisma'
import { ApproveSolicitationUseCase } from '../cashback/ApproveSolicitationUseCase'

class AutomaticApproveSolicitationChecker {
  protected approveUseCase: ApproveSolicitationUseCase

  constructor() {
    this.approveUseCase = new ApproveSolicitationUseCase()
  }

  async handle(solicitation: TransactionSolicitation) {
    const integrationCount = await prisma.integrationSettings.count({
      where: {
        companyId: solicitation.companyId,
        company: { paymentPlan: { canUseIntegration: true } },
      },
    })

    if (!integrationCount) return

    await this.approveUseCase.execute(solicitation)
  }
}

export = new AutomaticApproveSolicitationChecker()
