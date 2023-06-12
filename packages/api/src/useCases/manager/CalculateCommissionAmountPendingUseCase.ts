// select sum(t."takebackFeeAmount" * r."commissionPercentage") from transactions t
// inner join companies c on c.id = t."companiesId"
// inner join representatives r on r.id = c."representativeId"
// inner join transaction_status ts on ts.id = t."transactionStatusId"
// where ts.description in ('Em atraso', 'Pendente', 'Em processamento')

import { db } from "../../knex";

// select sum(cmp."amountPaid" * r."commissionPercentage") from company_monthly_payment cmp
// inner join companies c on c.id = cmp."companyId"
// inner join representatives r on r.id = c."representativeId"
// where cmp."isPaid" = false and cmp."isForgiven" = false

export class CalculateCommissionAmountPendingUseCase {
  async handle() {
    const transactions = await db
      .select<{ total: number }[]>(
        db.raw(
          'sum(transactions."takebackFeeAmount" * representatives."commissionPercentage") as total'
        )
      )
      .from("transactions")
      .join("companies", "companies.id", "transactions.companiesId")
      .join(
        "representatives",
        "representatives.id",
        "companies.representativeId"
      )
      .join(
        "transaction_status",
        "transaction_status.id",
        "transactions.transactionStatusId"
      )
      .whereIn("transaction_status.description", [
        "Em atraso",
        "Pendente",
        "Em processamento",
      ])
      .first();

    const monthlyPayments = await db
      .select<{ total: number }>(
        db.raw(
          'sum(company_monthly_payment."amountPaid" * representatives."commissionPercentage") as total'
        )
      )
      .from("company_monthly_payment")
      .join("companies", "companies.id", "company_monthly_payment.companyId")
      .join(
        "representatives",
        "representatives.id",
        "companies.representativeId"
      )
      .where({
        isPaid: false,
        isForgiven: false,
      })
      .first();

    return transactions.total + monthlyPayments.total;
  }
}
