import { NotificationType, Prisma } from "@prisma/client";
import { Expo as ExpoSdk, ExpoPushMessage } from "expo-server-sdk";

import { prisma } from "../../prisma";
import { Expo } from "../../services/expo";
import { EmailDto, sendMail } from "../../utils/SendMail";

export type User = {
  id: string;
  expoNotificationToken?: string;
  email?: string;
};

export enum UserType {
  CONSUMER = "CONSUMER",
  COMPANY_USER = "COMPANY_USER",
  TAKEBACK_USER = "TAKEBACK_USER",
}

export enum Via {
  DATABASE = "database",
  EXPO = "expo",
  EMAIL = "email",
}

export interface NotificationRecord {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export abstract class Notification {
  public abstract toRecord(): NotificationRecord;

  public abstract getType(): NotificationType;

  public abstract getUserType(): UserType;

  public abstract via(): Via[];

  private dontSendVia(via: Via) {
    return !this.via().includes(via);
  }

  private canSendVia(via: Via) {
    return this.via().includes(via);
  }

  public async toDatabase(id: string) {
    if (this.dontSendVia(Via.DATABASE)) return;

    const userIdObject = this.getUserIdObject(id);

    return prisma.notification.create({
      data: {
        type: this.getType(),
        ...this.toRecord(),
        ...userIdObject,
      },
    });
  }

  public async toExpo(id: string) {
    if (this.dontSendVia(Via.EXPO)) return;

    const { expoNotificationToken } = await prisma.consumer.findUniqueOrThrow({
      where: { id },
      select: { expoNotificationToken: true },
    });

    if (!expoNotificationToken) return;

    if (!ExpoSdk.isExpoPushToken(expoNotificationToken)) return;

    const { body, data, title } = this.toRecord();

    await Expo.sendNotification({
      to: expoNotificationToken,
      sound: "default",
      title,
      body,
      data,
    });
  }

  public async toEmail(id: string) {
    if (this.dontSendVia(Via.EMAIL)) return;

    const { email } = await this.getUser(id);

    if (!email) return;

    const { body, title } = this.toRecord();

    sendMail(email, title, body);
  }

  public async createMany(users: User[]) {
    const { body, data, title } = this.toRecord();
    const type = this.getType();

    const messages: ExpoPushMessage[] = [];
    const emailMessages: EmailDto[] = [];
    const createNotificationInput: Prisma.NotificationCreateManyInput[] = [];

    for (const user of users) {
      if (user.expoNotificationToken) {
        messages.push({
          to: user.expoNotificationToken,
          sound: "default",
          body,
          data,
          title,
        });
      }

      if (user.email) {
        emailMessages.push({
          to: user.email,
          subject: title,
          text: body,
        });
      }

      createNotificationInput.push({
        consumerId: user.id,
        body,
        title,
        type,
        data,
      });
    }

    if (this.canSendVia(Via.DATABASE)) {
      await prisma.notification.createMany({
        data: createNotificationInput,
      });
    }

    if (this.canSendVia(Via.EXPO)) {
      await Expo.sendInChunks(messages);
    }

    // if (this.canSendVia(Via.EMAIL)) {
    //   sendManyMails(emailMessages);
    // }
  }

  private getUserIdObject(id: string) {
    switch (this.getUserType()) {
      case UserType.CONSUMER:
        return { consumerId: id };
      case UserType.COMPANY_USER:
        return { companyUserId: id };
      case UserType.TAKEBACK_USER:
        return { takeBackUserId: id };
      default:
        throw new Error("Tipo inexistente");
    }
  }

  private getUser(id: string) {
    switch (this.getUserType()) {
      case UserType.CONSUMER:
        return prisma.consumer.findUniqueOrThrow({
          where: { id },
        });
      case UserType.COMPANY_USER:
        return prisma.companyUser.findUniqueOrThrow({
          where: { id },
        });
      case UserType.TAKEBACK_USER:
        return prisma.takebackUser.findUniqueOrThrow({
          where: { id },
        });
      default:
        throw new Error("Tipo inexistente");
    }
  }
}
