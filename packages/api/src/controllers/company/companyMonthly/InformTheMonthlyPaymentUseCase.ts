import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";

interface Props {
  montlhyId: number;
}

class InformTheMonthlyPaymentUseCase {
  async execute({ montlhyId }: Props) {
    if (!montlhyId) {
      throw new InternalError("Informe o id da mensalidade", 400);
    }

    const montlhy = await getRepository(CompanyMonthlyPayment).update(
      montlhyId,
      {
        paymentMade: true,
      }
    );

    if (montlhy.affected === 0) {
      throw new InternalError("Erro ao atualizar a mensalidade", 400);
    }

    return "Mensalidade atualizada";
  }
}

export { InformTheMonthlyPaymentUseCase };
