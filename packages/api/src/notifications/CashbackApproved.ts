import { NotificationType, Transaction } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class CashbackApproved extends Notification {
  constructor(
    protected transaction: Transaction,
    protected companyName: string,
    protected ticketsCount = 0
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.transaction.cashbackAmount);

    if (this.ticketsCount) {
      const ticketWord = this.ticketsCount === 1 ? "cupom" : "cupons";

      return {
        title: "Cashback e cupons aprovados 💰🎟️",
        body: `Seu cashback de ${money} foi aprovado em ${this.companyName.toUpperCase()} e você ganhou ${
          this.ticketsCount
        } ${ticketWord}.`,
        data: { id: this.transaction.id, ticketsCount: this.ticketsCount },
      };
    }

    return {
      title: "Cashback aprovado 💰",
      body: `Seu cashback de ${money} aprovado em ${this.companyName.toUpperCase()} e seu saldo foi atualizado.`,
      data: { id: this.transaction.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.CASHBACK_APPROVED;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
