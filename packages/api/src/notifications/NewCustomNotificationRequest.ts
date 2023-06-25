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
    protected title: string,
    protected message: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: this.title,
      body: this.message,
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
