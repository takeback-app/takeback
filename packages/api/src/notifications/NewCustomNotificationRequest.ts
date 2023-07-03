import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class NewCustomNotificationRequest extends Notification {
  constructor(
    protected notificationSolicitationId: string,
    protected responsibleName: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: "Nova solicitação de notificação",
      body: `Solicitação de notificação gerada para ${this.responsibleName}`,
      subject: "TakeBack - Nova solicitação de notificação",
      data: { notificationSolicitationId: this.notificationSolicitationId },
    };
  }

  public getType(): NotificationType {
    return NotificationType.NEW_CUSTOM_NOTIFICATION_REQUEST;
  }

  public getUserType(): UserType {
    return UserType.TAKEBACK_USER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EMAIL];
  }
}
