import { Request, Response } from "express";

import { RegisterPaymentMethodUseCase } from "./RegisterPaymentMethodUseCase";
import { FindPaymentMethodsUseCase } from "./FindPaymentMethodsUseCase";
import { UpdatePaymentMethodUseCase } from "./UpdatePaymentMethodUseCase";

class PaymentMethodController {
  async register(request: Request, response: Response) {
    const { description } = request.body;

    const register = new RegisterPaymentMethodUseCase();
    const find = new FindPaymentMethodsUseCase();

    const message = await register.execute({ description });
    const methods = await find.execute();

    return response.status(201).json({ message, methods });
  }

  async findAll(request: Request, response: Response) {
    const find = new FindPaymentMethodsUseCase();

    const methods = await find.execute();

    return response.status(200).json(methods);
  }

  async update(request: Request, response: Response) {
    const id = request.params.id;
    const { description } = request.body;

    const update = new UpdatePaymentMethodUseCase();
    const find = new FindPaymentMethodsUseCase();

    const message = await update.execute({ id: parseInt(id), description });
    const methods = await find.execute();

    return response.status(200).json({ message, methods });
  }
}

export { PaymentMethodController };
