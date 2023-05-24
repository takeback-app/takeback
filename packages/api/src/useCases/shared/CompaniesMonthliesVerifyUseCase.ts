import { getRepository, Between, ILike } from "typeorm";
import { Settings } from "../../database/models/Settings";
import { Companies } from "../../database/models/Company";
import { CompanyStatus } from "../../database/models/CompanyStatus";
import { PaymentPlans } from "../../database/models/PaymentPlans";
import { CompanyMonthlyPayment } from "../../database/models/CompanyMonthlyPayment";

class CompaniesMonthliesVerifyUseCase {
  async execute() {
    // Buscando as configurações
    const settings = await getRepository(Settings).findOne(1);

    // Calculando as datas necessárias
    const CURRENT_DATE = new Date();
    const VALIDATION_DATE = new Date(
      CURRENT_DATE.getFullYear(),
      CURRENT_DATE.getMonth(),
      settings.payDate
    );
    const DUE_DATE = new Date(
      CURRENT_DATE.getFullYear(),
      CURRENT_DATE.getMonth(),
      settings.payDate + 5
    );
    const FIRST_DAY_OF_MONTH = new Date(
      CURRENT_DATE.getFullYear(),
      CURRENT_DATE.getMonth(),
      1
    );
    const LAST_DAY_OF_MONTH = new Date(
      CURRENT_DATE.getFullYear(),
      CURRENT_DATE.getMonth() + 1,
      0
    );

    // Buscando as empresas
    const companies = await getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.firstAccessAllowedAt",
        "status.id",
        "status.description",
        "plan.id",
        "plan.value",
      ])
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(PaymentPlans, "plan", "plan.id = company.paymentPlan")
      .where("status.blocked = :blocked", { blocked: false })
      .getRawMany();

    // Buscando o status de inadimplente por mensalidade
    const monthlyBlockedStatus = await getRepository(CompanyStatus).findOne({
      where: {
        description: ILike("inadimplente por mensalidade"),
      },
    });

    // Percorrendo as empresa encontradas
    companies.map(async (company) => {
      const firstAccessDate = new Date(company.company_firstAccessAllowedAt);
      const firstAccessDate30 = new Date(
        firstAccessDate.setDate(firstAccessDate.getDate() + 30)
      );

      if (
        firstAccessDate30 <= CURRENT_DATE &&
        firstAccessDate30 <= VALIDATION_DATE
      ) {
        // Buscando a mensalidade da empresa, gerada no período do mês vigente
        const companyMonthlies = await getRepository(
          CompanyMonthlyPayment
        ).find({
          select: ["id", "isPaid", "isForgiven"],
          where: {
            createdAt: Between(FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH),
            company: company.company_id,
          },
        });

        // Verificando se a mensalidade do mês atual foi gerada
        if (companyMonthlies.length === 0) {
          // Gerando a tabela de mensalidade do mês atual da empresa
          const generated = await getRepository(CompanyMonthlyPayment).save({
            company: company.company_id,
            amountPaid: company.plan_value,
            dueDate: DUE_DATE,
            plan: company.plan_id,
          });

          if (generated) {
            // Marcando a mensalidade atual como não paga
            return await getRepository(Companies).update(company.company_id, {
              currentMonthlyPaymentPaid: false,
              periodFree: false,
            });
          }
        } else {
          // Verificando se a empresa pagou a mensalidade do mês vigente
          companyMonthlies.map(async (monthly) => {
            if (
              !monthly.isPaid &&
              !monthly.isForgiven &&
              company.status_description !== "Liberação provisória" &&
              CURRENT_DATE > DUE_DATE
            ) {
              // Atualizando o status da empresa para inadimplenete por mensalidade
              await getRepository(Companies).update(company.company_id, {
                status: monthlyBlockedStatus,
              });
            }
          });
        }
      }
    });

    return "Verificação completa!";
  }
}

export { CompaniesMonthliesVerifyUseCase };
