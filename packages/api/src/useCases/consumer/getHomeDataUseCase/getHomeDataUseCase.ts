import { Consumers } from "../../../database/models/Consumer";
import { TransactionStatus } from "../../../database/models/TransactionStatus";
import { consumerRepository } from "../../../database/repositories/consumerRepository";
import { transactionsRepository } from "../../../database/repositories/transactionsRepository";
import { prisma } from "../../../prisma";

export class GetHomeDataUseCase {
  async execute(consumerId: string) {
    const consumerData = await consumerRepository().findOne({
      relations: ["address", "address.city"],
      where: {
        id: consumerId,
      },
    });

    const companies = await prisma.company.findMany({
      where: {
        companyStatus: {
          generateCashback: true,
        },
      },
      select: {
        id: true,
        fantasyName: true,
        logoUrl: true,
        email: true,
        phone: true,
        createdAt: true,
        industry: { select: { description: true } },
        companyAddress: { include: { city: { select: { name: true } } } },
        companyPaymentMethods: true,
      },
    });

    const transactions = await transactionsRepository()
      .createQueryBuilder("t")
      .select("SUM(t.cashbackAmount)", "saved")
      .leftJoin(TransactionStatus, "status", "status.id = t.transactionStatus")
      .leftJoin(Consumers, "consumer", "consumer.id = t.consumers")
      .where("consumer.id = :consumerId", { consumerId })
      .andWhere("status.blocked = :blocked", { blocked: false })
      .getRawMany();

    const { expireBalanceDate } = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
      select: { expireBalanceDate: true },
    });

    return {
      consumerData,
      companyData: companies,
      totalSaved: parseFloat(transactions[0].saved),
      expireBalanceDate,
    };
  }
}
