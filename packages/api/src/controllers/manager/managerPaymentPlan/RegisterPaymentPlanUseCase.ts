import { InternalError } from '../../../config/GenerateErros'

import { prisma } from '../../../prisma'

interface Props {
  description: string
  value: number
  takebackBonus: number
  numberOfMonthlyRaffles: number
  numberOfMonthlyNotificationSolicitations: number
  canSendBirthdayNotification: boolean
  canAccessClientReport: boolean
  canUseIntegration: boolean
  newUserBonus: number
}

class RegisterPaymentPlanUseCase {
  async execute(dto: Props) {
    if (!dto.description) {
      throw new InternalError('Dados incompletos', 401)
    }

    const plan = await prisma.paymentPlan.findFirst({
      where: { description: dto.description },
    })

    if (plan) {
      throw new InternalError('Plano de pagamento já cadastrado', 400)
    }

    await prisma.paymentPlan.create({
      data: dto,
    })

    return 'Plano de pagamento cadastrado'
  }
}

export { RegisterPaymentPlanUseCase }
