import { InternalError } from "../../../config/GenerateErros";

import { prisma } from "../../../prisma";

interface Props {
  planId: number;
  description: string;
  value: number;
  takebackBonus: number;
  numberOfMonthlyRaffles: number;
  numberOfMonthlyNotificationSolicitations: number;
  canSendBirthdayNotification: boolean;
  canAccessClientReport: boolean;
  newUserBonus: number;
}

class UpdatePaymentPlanUseCase {
  async execute({ planId, ...dto }: Props) {
    if (!dto.description) {
      throw new InternalError("Dados incompletos", 401);
    }

    const plan = await prisma.paymentPlan.findFirst({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      throw new InternalError("Plano não encontrado", 404);
    }

    await prisma.paymentPlan.update({
      where: { id: planId },
      data: dto,
    });

    return "Plano de pagamento atualizado";
  }
}

export { UpdatePaymentPlanUseCase };
