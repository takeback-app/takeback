import { getRepository } from "typeorm";
import { PaymentPlans } from "../models/PaymentPlans";

function paymentPlanRepository() {
  return getRepository(PaymentPlans);
}

export { paymentPlanRepository };
