import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { DateTime } from "luxon";
import { maskCEP, maskCPF, maskPhone } from "../../utils/Masks";

export class ProfileController {
  async deactivate(request: Request, response: Response) {
    const consumerId = request["tokenPayload"].id;

    await prisma.consumer.update({
      where: { id: consumerId },
      data: { deactivatedAccount: true },
    });

    return response.json({ message: "ok" });
  }

  async notificationToken(request: Request, response: Response) {
    const { id: consumerId } = request["tokenPayload"];
    const { token } = request.body;

    await prisma.consumer.update({
      where: { id: consumerId },
      data: { expoNotificationToken: token },
    });

    return response.status(204).json();
  }

  async me(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const consumer = await prisma.consumer.findUnique({
      where: { id },
      select: {
        fullName: true,
        cpf: true,
        sex: true,
        birthDate: true,
        hasChildren: true,
        maritalStatus: true,
        monthlyIncomeId: true,
        schooling: true,
        phone: true,
        consumerAddress: {
          select: {
            street: true,
            district: true,
            number: true,
            complement: true,
            city: { select: { name: true } },
            zipCode: true,
          },
        },
      },
    });

    return response.json({
      name: consumer.fullName,
      cpf: maskCPF(consumer.cpf),
      sex: consumer.sex,
      birthday: DateTime.fromJSDate(consumer.birthDate).toFormat("dd/MM/yyyy"),
      hasChildren: consumer.hasChildren ? "sim" : "não",
      maritalStatus: consumer.maritalStatus,
      monthlyIncomeId: String(consumer.monthlyIncomeId),
      schooling: consumer.schooling,
      phone: maskPhone(consumer.phone),
      address: {
        street: consumer.consumerAddress.street,
        district: consumer.consumerAddress.district,
        number: consumer.consumerAddress.number,
        city: consumer.consumerAddress.city.name,
        zipCode: maskCEP(consumer.consumerAddress.zipCode),
        complement: consumer.consumerAddress.complement,
      },
    });
  }
}
