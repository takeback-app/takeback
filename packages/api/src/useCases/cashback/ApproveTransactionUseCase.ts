import { TransactionStatusEnum } from "../../enum/TransactionStatusEnum";
import { CashbackApproved, Notify } from "../../notifications";
import { prisma } from "../../prisma";
import { GenerateConsultantBonus } from "../consumer/bonus/GenerateConsultantBonus";
import { GenerateReferralBonus } from "../consumer/bonus/GenerateReferralBonus";
import { GenerateSellBonus } from "../consumer/bonus/GenerateSellBonus";
import { GenerateCashbackCommission } from "../representative/commission/GenerateCashbackCommission";

interface ExecuteDTO {
  transactionId: number;
  totalAmount: number;
  consumersId: string;
  companyName: string;
}

export class ApproveTransactionUseCase {
  private sellBonus: GenerateSellBonus;
  private consultantBonus: GenerateConsultantBonus;
  private referralBonus: GenerateReferralBonus;
  private cashbackCommission: GenerateCashbackCommission;

  constructor(private paymentOrderId: number) {
    this.sellBonus = new GenerateSellBonus();
    this.consultantBonus = new GenerateConsultantBonus();
    this.referralBonus = new GenerateReferralBonus();
    this.cashbackCommission = new GenerateCashbackCommission();
  }

  execute({ transactionId, companyName }: ExecuteDTO) {
    return Promise.all([
      this.approve(transactionId, companyName),
      this.sellBonus.create(transactionId),
      this.consultantBonus.create(transactionId),
      this.referralBonus.create(transactionId),
      this.cashbackCommission.create(transactionId),
    ]);
  }

  private async approve(transactionId: number, companyName: string) {
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
      where: {
        transactionId: transactionId,
        raffle: { drawDate: { gte: new Date() } },
      },
      data: { status: "ACTIVE" },
    });

    await prisma.raffleTicket.updateMany({
      where: {
        transactionId: transactionId,
        raffle: { drawDate: { lt: new Date() } },
        status: 'PENDING',
      },
      data: { status: "CANCELED" },
    });

    Notify.send(
      transaction.consumersId,
      new CashbackApproved(transaction, companyName, tickets.count)
    );
  }
}
