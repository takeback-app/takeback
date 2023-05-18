import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { PaymentPlans } from "../../../database/models/PaymentPlans";

interface Props {
  companyId: string;
  planId: number;
}

class UpdateCompanyMontlyPlanUseCase {
  async execute({ companyId, planId }: Props) {
    if (!companyId || !planId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não localizada", 400);
    }

    const paymentPlan = await getRepository(PaymentPlans).findOne(planId);

    if (!paymentPlan) {
      throw new InternalError("Plano não localizado", 400);
    }

    const updated = await getRepository(Companies).update(company.id, {
      paymentPlan,
    });

    if (updated.affected === 0) {
      throw new InternalError("Erro ao atualizar o plano da empresa", 400);
    }

    return "Plano aterado";
  }
}

export { UpdateCompanyMontlyPlanUseCase };
