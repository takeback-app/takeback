import { getRepository } from "typeorm";
import { CompanyMonthlyPayment } from "../../../database/models/CompanyMonthlyPayment";

class BillingPaymentMonthlyByMonthUseCase {
  async execute() {
    const monthlyPayments = await getRepository(CompanyMonthlyPayment)
      .createQueryBuilder("companyMonthly")
      .select("SUM(companyMonthly.amountPaid)", "value")
      .addSelect("DATE_TRUNC('month', companyMonthly.createdAt)", "date")
      .where("companyMonthly.isPaid = :status", { status: true })
      .groupBy("DATE_TRUNC('month', companyMonthly.createdAt)")
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

    monthlyPayments.map((item) => {
      labels.push(months[new Date(item.date).getMonth()]);
      values.push(parseFloat(item.value));
    });

    return { labels, values };
  }
}

export { BillingPaymentMonthlyByMonthUseCase };
