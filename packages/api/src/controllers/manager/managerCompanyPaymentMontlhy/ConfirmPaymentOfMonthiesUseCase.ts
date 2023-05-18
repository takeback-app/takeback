import { getRepository, ILike } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";
import { CompanyStatus } from "../../../database/models/CompanyStatus";

interface Props {
  monthlyIds: Array<number>;
}

class ConfirmPaymentOfMonthiesUseCase {
  async execute({ monthlyIds }: Props): Promise<Array<string>> {
    if (monthlyIds.length === 0) {
      throw new InternalError("Informe os ids das mensalidades", 400);
    }

    const successUpdate = [];

    await Promise.all(
      monthlyIds.map(async (item) => {
        // Buscando a empresa referente à mensalidade
        const monthly = await getRepository(CompanyMonthlyPayment).findOne({
          where: { id: item, isPaid: false, isForgiven: false },
          relations: ["company"],
        });

        if (!monthly) {
          return "Falha ao atualizar";
        }

        // Atualizando o status da mensalidade enviada
        const updated = await getRepository(CompanyMonthlyPayment).update(
          monthly.id,
          {
            isPaid: true,
            paidDate: new Date(),
          }
        );

        if (updated.affected === 0) {
          return "Falha ao atualizar";
        }

        // Buscando mensalidades atrasadas e não perdoadas da empresa
        const companyMonthlies = await getRepository(
          CompanyMonthlyPayment
        ).find({
          where: {
            company: monthly.company.id,
            isPaid: false,
            isForgiven: false,
          },
        });

        // Verificando se a empresa possui outras mensalidades pendentes
        if (companyMonthlies.length > 0) {
          const companyStatus = await getRepository(CompanyStatus).findOne({
            where: { description: ILike("inadimplente por mensalidade") },
          });

          // Atualizando o status da empresa para 'Inadimplente por mensalidade'
          await getRepository(Companies).update(monthly.company.id, {
            currentMonthlyPaymentPaid: true,
            status: companyStatus,
          });
        } else {
          const companyStatus = await getRepository(CompanyStatus).findOne({
            where: { description: ILike("ativo") },
          });

          // Atualizando o status da empresa para 'Ativo'
          const updated = await getRepository(Companies).update(
            monthly.company.id,
            {
              currentMonthlyPaymentPaid: true,
              status: companyStatus,
            }
          );

          if (updated.affected !== 0) {
            successUpdate.push(monthly.company.id);
          }
        }
      })
    );

    const companiesChangedToActiveStatus: string[] = [
      ...new Set(successUpdate),
    ];

    return companiesChangedToActiveStatus;
  }
}

export { ConfirmPaymentOfMonthiesUseCase };
