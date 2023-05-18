import { Request, Response } from "express";
import { FindPaymentPlanUseCase } from "./FindPaymentPlanUseCase";
import { RegisterPaymentPlanUseCase } from "./RegisterPaymentPlanUseCase";
import { UpdatePaymentPlanUseCase } from "./UpdatePaymentPlanUseCase";

class PaymentPlanController {
  async register(request: Request, response: Response) {
    const {
      description,
      value,
      takebackBonus,
      numberOfMonthlyRaffles,
      numberOfMonthlyNotificationSolicitations,
      canSendBirthdayNotification,
      newUserBonus,
    } = request.body;

    const register = new RegisterPaymentPlanUseCase();
    const find = new FindPaymentPlanUseCase();

    const message = await register.execute({
      description,
      value,
      takebackBonus,
      numberOfMonthlyRaffles: Number(numberOfMonthlyRaffles),
      numberOfMonthlyNotificationSolicitations: Number(
        numberOfMonthlyNotificationSolicitations
      ),
      canSendBirthdayNotification,
      newUserBonus: Number(newUserBonus),
    });
    const plans = await find.execute();

    return response.status(201).json({ message, plans });
  }

  async findAll(_request: Request, response: Response) {
    const find = new FindPaymentPlanUseCase();

    const plans = await find.execute();

    return response.status(200).json(plans);
  }

  async update(request: Request, response: Response) {
    const planId = request.params.id;

    const {
      description,
      value,
      takebackBonus,
      numberOfMonthlyRaffles,
      numberOfMonthlyNotificationSolicitations,
      canSendBirthdayNotification,
      newUserBonus,
    } = request.body;

    const update = new UpdatePaymentPlanUseCase();
    const find = new FindPaymentPlanUseCase();

    const message = await update.execute({
      planId: parseInt(planId),
      description,
      value,
      takebackBonus,
      numberOfMonthlyRaffles,
      numberOfMonthlyNotificationSolicitations,
      canSendBirthdayNotification,
      newUserBonus: Number(newUserBonus),
    });
    const plans = await find.execute();

    return response.status(200).json({ message, plans });
  }
}

export { PaymentPlanController };
