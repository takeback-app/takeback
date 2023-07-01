import ExpoSdk, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import { logger } from "./logger";
import { isDevelopment } from "../utils";

export const expo = new ExpoSdk();

export class Expo {
  public static async sendInChunks(messages: ExpoPushMessage[]) {
    if (isDevelopment()) return;

    const chunks = expo.chunkPushNotifications(messages);

    let tickets: ExpoPushTicket[] = [];

    for (let chunk of chunks) {
      try {
        const ticketChunks = await expo.sendPushNotificationsAsync(chunk);

        tickets.push(...ticketChunks);
      } catch (e) {
        logger.error(e);
      }
    }

    logger.info(tickets, "expo-debug");
  }

  public static async sendNotification(message: ExpoPushMessage) {
    if (isDevelopment()) return;

    try {
      const tickets = await expo.sendPushNotificationsAsync([message]);

      logger.info(tickets, "expo-debug");
    } catch (e) {
      logger.error(e);
    }
  }
}
