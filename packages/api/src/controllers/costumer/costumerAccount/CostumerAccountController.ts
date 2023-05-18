import { Request, Response } from "express";
import { DesactiveCostumerUseCase } from "./DesactiveCostumerUseCase";
import { RegisterCostumerUseCase } from "./RegisterCostumerUseCase";
import { VerifyIfUserAlreadyExistsUseCase } from "./VerifyIfUserAlreadyExistsUseCase";
import { prisma } from "../../../prisma";
import { Sex } from "@prisma/client";
import { DateTime } from "luxon";

class CostumerAccountController {
  async registerCostumer(request: Request, response: Response) {
    const data = request.body;

    const register = new RegisterCostumerUseCase();

    const result = await register.execute(data);

    return response.status(200).json(result);
  }

  async updateConsumer(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const {
      sex,
      birthday,
      hasChildren,
      maritalStatus,
      monthlyIncomeId,
      schooling,
      phone,
    } = request.body;

    const consumerData = {
      sex: sex as Sex,
      birthDate: birthday
        ? DateTime.fromFormat(birthday, "dd/MM/yyyy")
            .plus({ hours: 3 })
            .toJSDate()
        : undefined,
      hasChildren: hasChildren === "sim",
      maritalStatus,
      schooling,
      phone,
      monthlyIncomeId: monthlyIncomeId ? Number(monthlyIncomeId) : undefined,
    };

    await prisma.consumer.update({
      where: { id },
      data: consumerData,
    });

    return response.status(204).json();
  }

  async desactiveCostumer(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { password } = request.body;

    const desactive = new DesactiveCostumerUseCase();

    const result = await desactive.execute({
      consumerID,
      password,
    });

    return response.status(200).json(result);
  }

  async verifyIfUserAlreadyExists(request: Request, response: Response) {
    const { cpf } = request.params;

    const verify = new VerifyIfUserAlreadyExistsUseCase();

    const result = await verify.execute({ cpf });

    return response.status(200).json(result);
  }
}

export { CostumerAccountController };
