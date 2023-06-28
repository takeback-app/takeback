import { randomUUID } from "crypto";
import { prisma } from "../../prisma";
import {
  BonusType,
  SolicitationStatus,
  SolicitationType,
} from "@prisma/client";
import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { DateTime } from "luxon";

interface TransactionData {
  id: number;
  companyName: string;
  status: string;
  cashbackAmount: number;
  backAmount: number;
  amountPayWithTakebackBalance: number;
}

interface TransferData {
  id: number;
  consumerName: string;
  isReceived: boolean;
  amount: number;
}

interface BonusData {
  id: string;
  amount: number;
  type: BonusType;
}

interface BalanceExpirationData {
  id: string;
  amount: number;
}

interface SolicitationData {
  id: string;
  amount: number;
  companyName: string;
  type: SolicitationType;
  status: SolicitationStatus;
  text?: string;
}

type ExtractItemType =
  | { type: "TRANSACTION"; data: TransactionData }
  | { type: "TRANSFER"; data: TransferData }
  | { type: "BALANCE_EXPIRATION"; data: BalanceExpirationData }
  | { type: "BONUS"; data: BonusData }
  | { type: "SOLICITATION"; data: SolicitationData };

type ExtractItem = ExtractItemType & {
  id: string;
  referenceDate: Date;
};

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

    const filteredDates = dates.filter((date) => date);

    if (!filteredDates.length) return false;

    const firstRegisterDate = filteredDates.sort(
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
