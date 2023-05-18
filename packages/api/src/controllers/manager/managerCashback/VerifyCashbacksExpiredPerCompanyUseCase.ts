import { getRepository, ILike } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { CompanyStatus } from "../../../database/models/CompanyStatus";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { logger } from "../../../services/logger";

interface Props {
  companiesIds: Array<string>;
}

class VerifyCashbacksExpiredPerCompanyUseCase {
  async execute({ companiesIds }: Props) {
    if (companiesIds.length === 0) {
      return { message: "Verificação não realizada" };
    }

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Em atraso" },
    });

    const companyStatus = await getRepository(CompanyStatus).findOne({
      where: { description: ILike("inadimplente por cashbacks") },
    });

    companiesIds.map(async (company) => {
      const transactions = await getRepository(Transactions).find({
        where: { companies: company, transactionStatus },
      });

      if (transactions.length > 0) {
        await getRepository(Companies).update(company, {
          status: companyStatus,
        });

        logger.info(
          `Empresa (${company}) atualizada para ${companyStatus.description}`
        );
      }
    });

    return { message: "Verificação concluída" };
  }
}

export { VerifyCashbacksExpiredPerCompanyUseCase };
