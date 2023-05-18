import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { DateTime } from "luxon";
import { db } from "../../knex";
import { Notify } from "../../notifications";
import { BirthdayNotification } from "../../notifications/BirthdayNotification";
import { InternalError } from "../../config/GenerateErros";

export class BirthdayNotificationController {
  async index(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const date = DateTime.now().setZone("America/Sao_Paulo");

    const customers = await db
      .select("consumers.id")
      .from("consumers")
      .join("transactions", function () {
        this.on("transactions.consumersId", "consumers.id").andOnVal(
          "transactions.companiesId",
          companyId
        );
      })
      .whereRaw('extract(month from consumers."birthDate") = ?', [date.month])
      .whereRaw('extract(day from consumers."birthDate") = ?', [date.day])
      .groupBy("consumers.id");

    const nonCustomers = await db
      .select("consumers.id")
      .from("consumers")
      .leftJoin("transactions", function () {
        this.on("transactions.consumersId", "consumers.id").andOnVal(
          "transactions.companiesId",
          companyId
        );
      })
      .whereNull("transactions.id")
      .whereRaw('extract(month from consumers."birthDate") = ?', [date.month])
      .whereRaw('extract(day from consumers."birthDate") = ?', [date.day])
      .groupBy("consumers.id");

    const plan = await prisma.paymentPlan.findFirst({
      where: { companies: { some: { id: companyId } } },
    });

    const todayBirthdayNotification =
      await prisma.birthdayNotification.findFirst({
        where: {
          companyId,
          createdAt: { gte: date.startOf("day").toJSDate() },
        },
      });

    return response.json({
      numberOfCustomers: customers.length,
      numberOfNonCustomers: nonCustomers.length,
      hasSentToday: !!todayBirthdayNotification,
      hasAccess: plan.canSendBirthdayNotification,
    });
  }

  async store(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { title, message } = request.body;

    const date = DateTime.now().setZone("America/Sao_Paulo");

    const todayBirthdayNotification =
      await prisma.birthdayNotification.findFirst({
        where: {
          companyId,
          createdAt: { gte: date.startOf("day").toJSDate() },
        },
      });

    if (todayBirthdayNotification) {
      throw new InternalError("Já foi enviado uma notificação hoje.", 400);
    }

    const { id } = await prisma.birthdayNotification.create({
      data: { companyId },
    });

    const consumers = await db
      .select("consumers.id", "consumers.expoNotificationToken")
      .from("consumers")
      .whereRaw('extract(month from consumers."birthDate") = ?', [date.month])
      .whereRaw('extract(day from consumers."birthDate") = ?', [date.day]);

    Notify.sendMany(consumers, new BirthdayNotification(id, title, message));

    return response.status(201).json({ message: "Notificação enviada." });
  }
}
