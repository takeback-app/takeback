import { NotificationType, Transaction } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class NewPaymentOrder extends Notification {
  constructor(
    protected transaction: Transaction,
    protected companyName: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(+this.transaction.amountPayWithTakebackBalance);

    return {
      title: "Pagamento aprovado 💸",
      body: `Pagamento de ${money} em ${this.companyName} aprovado e seu saldo foi atualizado.`,
      data: { id: this.transaction.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_PAYMENT_ORDER;
  }

  public getUserType(): UserType {
    return UserType.TAKEBACK_USER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EMAIL];
  }
}
