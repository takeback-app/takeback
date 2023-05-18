import { NotificationType, Transaction } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class NewCashback extends Notification {
  constructor(
    protected transaction: Transaction,
    protected companyName: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.transaction.cashbackAmount);

    return {
      title: "Cashback lançado 💲",
      body: `Cashback de ${money} lançado em ${this.companyName}.`,
      data: { id: this.transaction.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_CASHBACK;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
