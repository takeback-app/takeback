import { getRepository } from "typeorm";
import { Transactions } from "../../database/models/Transaction";
import { TransactionStatus } from "../../database/models/TransactionStatus";

export class BonusTakebackPerMonthUseCase {
	async execute() {
		const bonusTakebackPerMonth = await getRepository(Transactions)
			.createQueryBuilder("transaction")
			.select("SUM(transaction.cashbackAmount)", "value")
			.addSelect("DATE_TRUNC('month', transaction.createdAt)", "date")
			.leftJoin(
				TransactionStatus,
				"status",
				"status.id = transaction.transactionStatus"
			)
			.where("status.description = :status", { status: "Gratificação Takeback" })
			.groupBy("DATE_TRUNC('month', transaction.createdAt)")
			.getRawMany();

		const labels = [];
		const values = [];

		const months = [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro",
		];

		bonusTakebackPerMonth.map((item) => {
			labels.push(months[new Date(item.date).getMonth()]);
			values.push(parseFloat(item.value));
		});

		return { labels, values };

	}
}
