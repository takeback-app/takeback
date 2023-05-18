import { Request, Response } from "express";
import { FindCompaniesMontlhiesUseCase } from "./FindCompaniesMontlhiesUseCase";
import { ConfirmPaymentOfMonthiesUseCase } from "./ConfirmPaymentOfMonthiesUseCase";
import { VerifyCashbacksExpiredPerCompanyUseCase } from "../managerCashback/VerifyCashbacksExpiredPerCompanyUseCase";
import { ForgivenCompanyPaymentMonthlyUseCase } from "./ForgivenCompanyPaymentMonthlyUseCase";
import { UpdatePaymentMonthlyPlanUseCase } from "./UpdatePaymentMonthlyPlanUseCase";

class ManagerCompanyPaymentMontlhyController {
  async findCompanyMonthlies(request: Request, response: Response) {
    const filters = request.query;

    const find = new FindCompaniesMontlhiesUseCase();

    const result = await find.execute({ filters });

    response.status(200).json(result);
  }

  async confirmPaymentMonthly(request: Request, response: Response) {
    const { monthlyIds } = request.body;
    const filters = request.query;

    const confirm = new ConfirmPaymentOfMonthiesUseCase();
    const verifyCashbacks = new VerifyCashbacksExpiredPerCompanyUseCase();
    const find = new FindCompaniesMontlhiesUseCase();

    const companiesChangedToActiveStatus = await confirm.execute({
      monthlyIds,
    });

    await verifyCashbacks.execute({
      companiesIds: companiesChangedToActiveStatus,
    });

    const monthlies = await find.execute({ filters });

    response.status(200).json({ message: "Concluído", monthlies });
  }

  async forgivenPaymentMonthly(request: Request, response: Response) {
    const { monthlyIds } = request.body;
    const filters = request.query;

    const forgiven = new ForgivenCompanyPaymentMonthlyUseCase();
    const verifyCashbacks = new VerifyCashbacksExpiredPerCompanyUseCase();
    const find = new FindCompaniesMontlhiesUseCase();

    const companiesChangedToActiveStatus = await forgiven.execute({
      monthlyIds,
    });

    await verifyCashbacks.execute({
      companiesIds: companiesChangedToActiveStatus,
    });

    const monthlies = await find.execute({ filters });

    response.status(200).json({ message: "Concluído", monthlies });
  }

  async updatePaymentMonthlyPlan(request: Request, response: Response) {
    const { monthlyIds, planId } = request.body;
    const filters = request.query;

    const update = new UpdatePaymentMonthlyPlanUseCase();
    const verifyCashbacks = new VerifyCashbacksExpiredPerCompanyUseCase();
    const find = new FindCompaniesMontlhiesUseCase();

    const companiesChangedToActiveStatus = await update.execute({
      monthlyIds,
      planId,
    });

    await verifyCashbacks.execute({
      companiesIds: companiesChangedToActiveStatus,
    });

    const monthlies = await find.execute({ filters });

    response.status(200).json({ message: "Concluído", monthlies });
  }
}

export { ManagerCompanyPaymentMontlhyController };
