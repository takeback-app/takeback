import ExpoSdk, { ExpoPushMessage } from "expo-server-sdk";
import { logger } from "./logger";
import { isDevelopment } from "../utils";

export const expo = new ExpoSdk();

export class Expo {
  public static async sendInChunks(messages: ExpoPushMessage[]) {
    if (isDevelopment()) return;

    const chunks = expo.chunkPushNotifications(messages);

    for (let chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (e) {
        logger.error(e);
      }
    }
  }

  public static async sendNotification(message: ExpoPushMessage) {
    if (isDevelopment()) return;

    try {
      await expo.sendPushNotificationsAsync([message]);
    } catch (e) {
      logger.error(e);
    }
  }
}
