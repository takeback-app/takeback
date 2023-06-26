import { DateTime } from "luxon";
import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { prisma } from "../../prisma";

export class GetFirstExtractRegisterUseCase {
  private month?: DateTime;

  constructor(private consumerId: string, page: number = 0) {
    if (!page) return;

    this.month = DateTime.now()
      .minus({ months: page - 1 })
      .endOf("month");
  }

  async execute() {
    const { firstExtractItemDate } = await prisma.consumer.findFirstOrThrow({
      where: { id: this.consumerId },
    });

    if (firstExtractItemDate) {
      return this.month.toISODate() > firstExtractItemDate.toISOString();
    }

    const dates = await Promise.all([
      this.transactions(),
      this.transfers(),
      this.balanceExpirations(),
      this.bonuses(),
      this.solicitations(),
    ]);

    if (!dates.length) return false;

    const firstRegisterDate = dates.sort(
      (a, b) => a.getTime() - b.getTime()
    )[0];

    await prisma.consumer.update({
      where: { id: this.consumerId },
      data: { firstExtractItemDate: firstRegisterDate },
    });

    return this.month.toISODate() > firstRegisterDate.toISOString();
  }

  async transactions() {
    const transactions = await prisma.transaction.aggregate({
      where: {
        consumersId: this.consumerId,
        transactionStatus: {
          description: { notIn: [TransactionStatusEnum.WAITING] },
        },
      },
      _min: { createdAt: true },
    });

    return transactions._min.createdAt;
  }

  async transfers() {
    const transfers = await prisma.transfer.aggregate({
      where: {
        OR: [
          { consumerSentId: this.consumerId },
          { consumerReceivedId: this.consumerId },
        ],
      },
      _min: { createdAt: true },
    });

    return transfers._min.createdAt;
  }

  async balanceExpirations() {
    const balanceExpirations = await prisma.consumerExpireBalances.aggregate({
      where: { consumerId: this.consumerId },
      _min: { expireAt: true },
    });

    return balanceExpirations._min.expireAt;
  }

  async bonuses() {
    const bonuses = await prisma.bonus.aggregate({
      where: { consumerId: this.consumerId },
      _min: { createdAt: true },
    });

    return bonuses._min.createdAt;
  }

  async solicitations() {
    const solicitations = await prisma.transactionSolicitation.aggregate({
      where: {
        consumerId: this.consumerId,
        status: { not: "APPROVED" },
      },
      _min: { createdAt: true },
    });

    return solicitations._min.createdAt;
  }
}
