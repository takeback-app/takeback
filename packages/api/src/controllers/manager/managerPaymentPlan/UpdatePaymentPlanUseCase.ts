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
  newUserBonus: number;
}

class UpdatePaymentPlanUseCase {
  async execute({
    description,
    planId,
    value,
    takebackBonus,
    numberOfMonthlyRaffles,
    numberOfMonthlyNotificationSolicitations,
    canSendBirthdayNotification,
    newUserBonus,
  }: Props) {
    if (!description) {
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
      data: {
        description,
        value,
        takebackBonus,
        numberOfMonthlyRaffles,
        numberOfMonthlyNotificationSolicitations,
        canSendBirthdayNotification,
        newUserBonus,
      },
    });

    return "Plano de pagamento atualizado";
  }
}

export { UpdatePaymentPlanUseCase };
