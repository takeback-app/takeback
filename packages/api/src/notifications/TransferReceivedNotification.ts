import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";
import { currency } from "../utils/Masks";

export class TransferReceivedNotification extends Notification {
  constructor(protected value: number, protected senderName: string) {
    super();
  }

  public toRecord(): NotificationRecord {
    const money = currency(this.value);

    return {
      title: "Transferência recebida 💰",
      body: `Você recebeu ${money} de ${this.senderName} e o valor já está disponível no seu saldo!`,
      data: {},
    };
  }

  public getType(): NotificationType {
    return NotificationType.CUSTOM;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
