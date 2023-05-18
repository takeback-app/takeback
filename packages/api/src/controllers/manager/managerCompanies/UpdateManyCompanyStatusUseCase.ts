import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { logger } from "../../../services/logger";

interface Props {
  statusId: number;
  companyIds: Array<string>;
}

// INUTILIZADO
class UpdateManyCompanyStatusUseCase {
  async execute({ statusId, companyIds }: Props) {
    if (!statusId || companyIds.length === 0) {
      throw new InternalError("Informe o status e as empresas", 400);
    }

    const companies = await getRepository(Companies).find({
      where: { id: In([...companyIds]) },
      relations: ["status", "users"],
    });

    companies.map((item) => {
      if (item.currentMonthlyPaymentPaid) {
        throw new InternalError(
          `Empresa ${item.fantasyName} está com a mensalidade em dias`,
          400
        );
      }

      if (item.status.blocked) {
        throw new InternalError(
          `A empresa'${item.fantasyName}' não possui acesso ao sistema`,
          400
        );
      }

      if (!item.status.blocked && item.users.length === 0) {
        throw new InternalError(
          `A empresa'${item.fantasyName}' não possui usuários`,
          400
        );
      }
    });

    const expiredTransactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select(["transaction.id", "transaction.createdAt"])
      .addSelect(["status.description", "company.id"])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("status.description IN (:...status)", {
        status: ["Em atraso"],
      })
      .andWhere("transaction.companies IN (:...companyIds)", {
        companyIds: [...companyIds],
      })
      .getRawMany();

    const transactionsReduced = expiredTransactions.reduce(
      (previousValue, currentValue) => {
        previousValue[currentValue.company_id] =
          previousValue[currentValue.company_id] || [];
        previousValue[currentValue.company_id].push(currentValue);
        return previousValue;
      },
      Object.create(null)
    );

    const transactionGroupedPerCompany = [];
    for (const [key, values] of Object.entries(transactionsReduced)) {
      transactionGroupedPerCompany.push({
        companyId: key,
        transactions: values,
      });
    }

    const blockedByCashback = await getRepository(CompanyStatus).findOne({
      where: { description: "Inadimplente por cashbacks" },
    });

    const statusActive = await getRepository(CompanyStatus).findOne({
      where: { description: "Ativo" },
    });

    companies.map(async (item) => {
      if (
        transactionGroupedPerCompany.find(
          (company) => company.companyId === item.id
        )
      ) {
        await getRepository(Companies).update(item.id, {
          status: blockedByCashback,
          currentMonthlyPaymentPaid: true,
        });

        logger.info(
          `Empresa (${item.id}) atualizada para ${blockedByCashback.description}`
        );
      } else {
        await getRepository(Companies).update(item.id, {
          status: statusActive,
          currentMonthlyPaymentPaid: true,
        });
      }
    });

    return "Status atualizado";
  }
}

export { UpdateManyCompanyStatusUseCase };
