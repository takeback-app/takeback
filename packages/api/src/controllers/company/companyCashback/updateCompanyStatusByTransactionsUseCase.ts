import { getRepository } from "typeorm";
import { Companies } from "../../../database/models/Company";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { CompanyStatus } from "../../../database/models/CompanyStatus";

export class updateCompanyStatusByTransactionsUseCase {
  async execute(companyId: string) {
    const verifyTransactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select(["transaction.id", "transaction.createdAt"])
      .addSelect(["status.description", "company.id"])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("company.id = :companyId", { companyId })
      .andWhere("status.description = :status", { status: "Em atraso" })
      .getRawMany();

    const overStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Inadimplente por cashbacks" },
    });
    const activeStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Ativo" },
    });

    if (verifyTransactions.length > 0) {
      await getRepository(Companies).update(companyId, {
        status: overStatus,
      });
    } else {
      await getRepository(Companies).update(companyId, {
        status: activeStatus,
      });
    }
  }
}
