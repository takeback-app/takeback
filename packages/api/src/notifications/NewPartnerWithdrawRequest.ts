import { NotificationType, WithdrawOrder } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class NewPartnerWithdrawRequest extends Notification {
  constructor(
    protected withdrawOrder: WithdrawOrder,
    protected companyName: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Novo pedido de saque de Parceiro",
      body: `Pedido de saque de ${this.withdrawOrder.value} gerado para ${this.companyName}`,
      subject: "TakeBack - Novo pedido de saque de Parceiro",
      data: { WithdrawOrderId: this.withdrawOrder.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_PARTNER_WITHDRAW_REQUEST;
  }

  public getUserType(): UserType {
    return UserType.TAKEBACK_USER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EMAIL];
  }
}
