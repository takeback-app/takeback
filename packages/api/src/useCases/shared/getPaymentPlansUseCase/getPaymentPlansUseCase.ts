import { paymentPlanRepository } from "../../../database/repositories/paymentPlanRepository";

export class GetPaymentPlansUseCase {
  async execute() {
    const paymentPlans = await paymentPlanRepository().find();

    return paymentPlans;
  }
}
