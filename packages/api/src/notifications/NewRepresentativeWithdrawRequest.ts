import { NotificationType, WithdrawOrder } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class NewRepresentativeWithdrawRequest extends Notification {
  constructor(
    protected withdrawOrder: WithdrawOrder,
    protected responsibleName: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Novo pedido de saque de Representante",
      body: `Pedido de saque de ${this.withdrawOrder.value} gerado para ${this.responsibleName}`,
      subject: "TakeBack - Novo pedido de saque de Representante",
      data: { WithdrawOrderId: this.withdrawOrder.id },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_REPRESENTATIVE_WITHDRAW_REQUEST;
  }

  public getUserType(): UserType {
    return UserType.TAKEBACK_USER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EMAIL];
  }
}
