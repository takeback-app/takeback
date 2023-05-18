import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { CashbackApproved, Notify } from "../../notifications";
import { prisma } from "../../prisma";
import { GenerateSellBonus } from "../consumer/bonus/GenerateSellBonus";

interface ExecuteDTO {
  transactionId: number;
  totalAmount: number;
  consumersId: string;
  companiesId: string;
}

export class ApproveTransactionUseCase {
  private sellBonus: GenerateSellBonus;

  constructor(private paymentOrderId: number) {
    this.sellBonus = new GenerateSellBonus();
  }

  execute({ transactionId, ...rest }: ExecuteDTO) {
    return Promise.all([
      this.approve(transactionId),
      this.sellBonus.create(transactionId),
    ]);
  }

  private async approve(transactionId: number) {
    const status = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.APPROVED },
    });

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        transactionStatusId: status.id,
        approvedAt: new Date(),
        paymentOrderId: this.paymentOrderId,
      },
    });

    const tickets = await prisma.raffleTicket.updateMany({
      where: { transactionId: transactionId },
      data: { status: "ACTIVE" },
    });

    Notify.send(
      transaction.consumersId,
      new CashbackApproved(transaction, tickets.count)
    );
  }
}
