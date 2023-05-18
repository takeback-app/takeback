import { getRepository, In, IsNull } from "typeorm";
import { Transactions } from "../../../database/models/Transaction";
import { TransactionStatus } from "../../../database/models/TransactionStatus";

interface Props {
  companyId: string;
  userId: string;
}

class ReportCashbackByPeriodUseCase {
  async execute({ companyId, userId }: Props) {
    const date = new Date();
    const today = date.toLocaleDateString();
    const sevenDaysAgo = new Date(
      date.setDate(date.getDate() - 7)
    ).toLocaleDateString();

    /* RELATÓRIO DE CASHBACK's DOS ÚLTIMOS 7 DIAS */

    // Buscando os status de transações válidos
    const transactionStatus = await getRepository(TransactionStatus).find({
      select: ["id"],
      where: {
        description: In(["Pendente", "Aprovada"]),
      },
    });

    // Criando array com os IDs dos tipos de transações válidas
    const transactionStatusIds = [];
    transactionStatus.map((item) => {
      transactionStatusIds.push(item.id);
    });

    // Buscando as transações realizadas no período
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transactions")
      .select("transactions.dateAt")
      .addSelect("SUM(transactions.cashbackAmount)", "sum")
      .where("transactions.companies = :companyId", { companyId })
      .andWhere(
        "transactions.dateAt > :sevenDaysAgo AND transactions.dateAt <= :today",
        { sevenDaysAgo, today }
      )
      .andWhere("transactions.transactionStatus IN (:...transactionStatusId)", {
        transactionStatusId: [...transactionStatusIds],
      })
      .groupBy("transactions.dateAt")
      .orderBy("transactions.dateAt", "DESC")
      .getRawMany();

    // Formatando os dados para reposta
    const days = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const daysToReturn = [];
    const result = [];
    let totalCashbacksValue = 0;
    transactions.map((item) => {
      result.push(item.sum);
      daysToReturn.push(days[item.transactions_dateAt.getDay()]);

      totalCashbacksValue = totalCashbacksValue + item.sum;
    });

    const values = result.reverse();
    const labels = daysToReturn.reverse();

    return { values, labels };
  }
}

export { ReportCashbackByPeriodUseCase };
