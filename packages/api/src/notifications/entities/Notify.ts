import { Cache } from "../../redis";
import { notificationCountKey } from "../../services/cacheKeys";
import { Notification, User } from "./Notification";

export class Notify {
  public static async send(userId: string, notification: Notification) {
    await notification.toDatabase(userId);
    await notification.toExpo(userId);
    await notification.toEmail(userId);

    await Cache.increment(notificationCountKey(userId));
  }

  public static async sendMany(users: User[], notification: Notification) {
    await notification.createMany(users);
  }
}
