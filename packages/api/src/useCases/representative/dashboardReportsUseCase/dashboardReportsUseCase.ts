import { In } from "typeorm";
import { representativeRepository } from "../../../database/repositories/representativeRepository";
import { transactionsRepository } from "../../../database/repositories/transactionsRepository";
import { transactionsStatusRepository } from "../../../database/repositories/transactionsStatusRepository";

type DashboardReportsUseCaseProps = {
  representativeId: string;
};

export class DashboardReportsUseCase {
  async execute({ representativeId }: DashboardReportsUseCaseProps) {
    const representative = await representativeRepository().findOne({
      where: {
        id: representativeId,
      },
    });

    const transactionStatus = await transactionsStatusRepository().find({
      where: {
        description: In([
          "Pendente",
          "Aprovada",
          "Em processamento",
          "Em atraso",
        ]),
      },
    });

    const statusIds = [];
    transactionStatus.map((item) => {
      statusIds.push(item.id);
    });

    const transactions = await transactionsRepository()
      .createQueryBuilder("transactions")
      .select("SUM(transactions.totalAmount)", "totalBilling")
      .addSelect("SUM(transactions.cashbackAmount)", "cashbackAmount")
      .addSelect("SUM(transactions.takebackFeeAmount)", "takebackFeeAmount")
      .leftJoin("transactions.companies", "company")
      .leftJoin("company.representative", "representative")
      .leftJoin("transactions.transactionStatus", "status")
      .where("representative.id = :representativeId", { representativeId })
      .andWhere("status.id IN (:...statusIds)", { statusIds: [...statusIds] })
      .execute();

    const representativeFeeAmount =
      transactions[0].takebackFeeAmount * representative.gainPercentage;

    const data = {
      companyBilling: parseFloat(transactions[0].totalBilling),
      cashbackAmount: parseFloat(transactions[0].cashbackAmount),
      representativeAmount: representativeFeeAmount,
      representativeBalance: representative.balance,
    };

    return data;
  }
}
