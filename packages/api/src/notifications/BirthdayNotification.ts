import { NotificationType } from "@prisma/client";
import {
  Notification,
  NotificationRecord,
  UserType,
  Via,
} from "./entities/Notification";

export class BirthdayNotification extends Notification {
  constructor(
    protected birthdayNotificationId: string,
    protected title: string,
    protected message: string
  ) {
    super();
  }

  public toRecord(): NotificationRecord {
    return {
      title: this.title,
      body: this.message,
      data: { birthdayNotificationId: this.birthdayNotificationId },
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
