import { NotificationType, Prisma } from "@prisma/client";
import { Expo as ExpoSdk, ExpoPushMessage } from "expo-server-sdk";

import { prisma } from "../../prisma";
import { Expo } from "../../services/expo";

import fs from "fs";
import path from "path";
import hbs from "handlebars";
import transporter from "../../config/SMTP";

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
  subject?: string;
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

    const { title, body, data } = this.toRecord();

    return prisma.notification.create({
      data: {
        type: this.getType(),
        title,
        body,
        data,
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

    const { title, body, subject } = this.toRecord();

    const html = this.getEmailTemplate(title, body);

    var mailOptions = {
      from: process.env.MAIL_CONFIG_USER,
      to: email,
      subject,
      html,
    };

    transporter.sendMail(mailOptions);
  }

  public async createMany(users: User[]) {
    const { body, data, title, subject } = this.toRecord();
    const type = this.getType();

    const messages: ExpoPushMessage[] = [];
    const emailList: string[] = [];
    const createNotificationInput: Prisma.NotificationCreateManyInput[] = [];

    for (const user of users) {
      const userObject = this.getUserIdObject(user.id);

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
        emailList.push(user.email);
      }

      createNotificationInput.push({
        ...userObject,
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

    if (this.canSendVia(Via.EMAIL)) {
      const html = this.getEmailTemplate(title, body);

      for (const email of emailList) {
        transporter.sendMail({
          from: process.env.MAIL_CONFIG_USER,
          to: email,
          subject,
          html,
        });
      }
    }
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

  private getEmailTemplate(title: string, body: string) {
    const emailTemplate = fs.readFileSync(
      path.resolve("src/utils/emailTemplates/template1.hbs"),
      "utf-8"
    );

    const template = hbs.compile(emailTemplate);

    return template({
      title: title,
      sectionOne: body,
      sectionThree: "Abraços! Equipe TakeBack :)",
    });
  }
}
