import { Request, Response } from "express";

import { FindPaymentMethodsUseCase } from "./FindPaymentMethodsUseCase";
import { FindCompanyPaymentMethodsUseCase } from "./FindCompanyPaymentMethodsUseCase";
import { FindCompanyPaymentMethodsForCashierUseCase } from "./FindCompanyPaymentMethodsForCashierUseCase";
import { UpdateCompanyPaymentMethodsUseCase } from "./UpdateCompanyPaymentMethodsUseCase";
import { RegisterCompanyPaymentMethodsUseCase } from "./RegisterCompanyPaymentMethodsUseCase";

class PaymentMethodsController {
  async findPaymentMethods(request: Request, response: Response) {
    const find = new FindPaymentMethodsUseCase();

    const methods = await find.execute();

    return response.status(200).json(methods);
  }

  async findCompanyPaymentMethods(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const find = new FindCompanyPaymentMethodsUseCase();

    const methods = await find.execute({ companyId });

    return response.status(200).json(methods);
  }

  async findCompanyPaymentMethodsForCashier(
    request: Request,
    response: Response
  ) {
    const { companyId } = request["tokenPayload"];

    const findCompanyMethods = new FindCompanyPaymentMethodsForCashierUseCase();

    const result = await findCompanyMethods.execute({ companyId });

    return response.status(200).json(result);
  }

  async updateCompanyPaymentMethod(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { cashbackPercentage, isActive, paymentId } = request.body;

    const updateCompanyMethod = new UpdateCompanyPaymentMethodsUseCase();
    const findCompanyMethods = new FindCompanyPaymentMethodsUseCase();

    const message = await updateCompanyMethod.execute({
      cashbackPercentage,
      companyId,
      isActive,
      paymentId,
    });

    const companyMethods = await findCompanyMethods.execute({ companyId });

    return response.status(200).json({ message, companyMethods });
  }

  async registerCompanyPaymentMethod(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { cashbackPercentage, paymentId } = request.body;

    const registerCompanyMethod = new RegisterCompanyPaymentMethodsUseCase();
    const findCompanyMethods = new FindCompanyPaymentMethodsUseCase();

    const message = await registerCompanyMethod.execute({
      cashbackPercentage,
      companyId,
      paymentId,
    });

    const companyMethods = await findCompanyMethods.execute({ companyId });

    return response.status(200).json({ message, companyMethods });
  }
}

export { PaymentMethodsController };
