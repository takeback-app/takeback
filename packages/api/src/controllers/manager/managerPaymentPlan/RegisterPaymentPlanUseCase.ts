import { InternalError } from "../../../config/GenerateErros";

import { prisma } from "../../../prisma";

interface Props {
  description: string;
  value: number;
  takebackBonus: number;
  numberOfMonthlyRaffles: number;
  numberOfMonthlyNotificationSolicitations: number;
  canSendBirthdayNotification: boolean;
  newUserBonus: number;
}

class RegisterPaymentPlanUseCase {
  async execute({
    description,
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
      where: { description },
    });

    if (plan) {
      throw new InternalError("Plano de pagamento já cadastrado", 400);
    }

    await prisma.paymentPlan.create({
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

    return "Plano de pagamento cadastrado";
  }
}

export { RegisterPaymentPlanUseCase };
