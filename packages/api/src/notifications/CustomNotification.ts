import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class CustomNotification extends Notification {
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
    return NotificationType.CUSTOM;
  }

  public getUserType(): UserType {
    return UserType.CONSUMER;
  }

  public via(): Via[] {
    return [Via.DATABASE, Via.EXPO];
  }
}
