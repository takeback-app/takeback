import { SolicitationType } from "@prisma/client";
import { prisma } from "../../prisma";
import { DateTime } from "luxon";
import { InternalError } from "../../config/GenerateErros";
import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";

interface CreateSolicitationDTO {
  valueInCents: number;
  companyId: string;
  consumerId: string;
  companyPaymentMethodId: number;
}

export class SolicitationUseCase {
  async createCashback(dto: CreateSolicitationDTO) {
    const { companyId, consumerId, valueInCents } = dto;

    await this.validateNotDuplicatedTransaction(
      consumerId,
      companyId,
      valueInCents / 100
    );

    await this.checkRateLimit(consumerId);

    return this.execute(SolicitationType.CASHBACK, dto);
  }

  async createPayment(dto: CreateSolicitationDTO) {
    await this.validateCostumerBalance(dto.valueInCents, dto.consumerId);

    return this.execute(SolicitationType.PAYMENT, dto);
  }

  async execute(type: SolicitationType, dto: CreateSolicitationDTO) {
    return prisma.transactionSolicitation.create({
      data: { type, ...dto },
    });
  }

  private async checkRateLimit(consumerId: string) {
    const solicitation = await prisma.transactionSolicitation.findFirst({
      where: {
        consumerId,
        status: "WAITING",
        type: "CASHBACK",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!solicitation) return;

    const diffInMinutes = Math.ceil(
      Math.abs(
        DateTime.fromJSDate(solicitation.createdAt).diffNow("minute").minutes
      )
    );

    if (diffInMinutes <= 15) {
      throw new InternalError(
        "Você acabou de solicitar um cashback. Aguarde um momento para solicitar novamente.",
        400
      );
    }
  }

  private async validateCostumerBalance(
    valueInCents: number,
    consumerId: string
  ) {
    const { balance } = await prisma.consumer.findUniqueOrThrow({
      where: { id: consumerId },
      select: { balance: true },
    });

    const solicitations = await prisma.transactionSolicitation.aggregate({
      where: { consumerId, status: "WAITING", type: "PAYMENT" },
      _sum: { valueInCents: true },
    });

    const balanceInCents = Math.round(+balance * 100);
    const newBalanceInCents = solicitations._sum.valueInCents + valueInCents;

    if (newBalanceInCents > balanceInCents) {
      throw new InternalError(
        "Saldo insuficiente para essa solicitação. Verifique suas solicitações e seu saldo.",
        400
      );
    }
  }

  private async validateNotDuplicatedTransaction(
    consumerId: string,
    companyId: string,
    value: number
  ) {
    const yesterday = DateTime.now()
      .startOf("day")
      .minus({ day: 1 })
      .toJSDate();

    const transaction = await prisma.transaction.findFirst({
      where: {
        companiesId: companyId,
        consumersId: consumerId,
        totalAmount: value,
        transactionStatus: {
          description: { in: [TransactionStatusEnum.PENDING] },
        },
        createdAt: { gte: yesterday },
      },
    });

    if (transaction) {
      throw new InternalError(
        "Já existe um lançamento igual a este. Verifique seu extrato para conferência. Em caso de irregularidade, contate a empresa para lançar manualmente.",
        400
      );
    }
  }
}
