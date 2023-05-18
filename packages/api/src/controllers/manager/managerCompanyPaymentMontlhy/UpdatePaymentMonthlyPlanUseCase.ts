import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";
import { PaymentPlans } from "../../../database/models/PaymentPlans";

interface Props {
  monthlyIds: Array<number>;
  planId: number;
}

class UpdatePaymentMonthlyPlanUseCase {
  async execute({ monthlyIds, planId }: Props) {
    if (monthlyIds.length === 0 || !planId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const successUpdate = [];

    await Promise.all(
      monthlyIds.map(async (item) => {
        // Buscando os dados da mensalidade e da empresa referente
        const monthly = await getRepository(CompanyMonthlyPayment).findOne({
          where: { id: item, isPaid: false, isForgiven: false },
          relations: ["company"],
        });

        if (!monthly) {
          return "Falha ao atualizar";
        }

        // Buscando o plano para a atualização
        const newPlan = await getRepository(PaymentPlans).findOne({
          where: { id: planId },
        });

        // Atualizando o valor do plano da mensalidade
        const updated = await getRepository(CompanyMonthlyPayment).update(
          monthly.id,
          {
            plan: newPlan,
            amountPaid: newPlan.value,
          }
        );

        if (updated.affected !== 0) {
          successUpdate.push(monthly.company.id);
        }
      })
    );

    const companiesChangedToActiveStatus: string[] = [
      ...new Set(successUpdate),
    ];

    return companiesChangedToActiveStatus;
  }
}

export { UpdatePaymentMonthlyPlanUseCase };
