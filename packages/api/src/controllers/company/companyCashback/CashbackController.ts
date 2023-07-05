import { Request, Response } from "express";

import { GetConsumerInfoUseCase } from "./GetConsumerInfoUseCase";
import { CancelCashBackUseCase } from "./CancelCashBackUseCase";
import { FindPendingCashbacksUseCase } from "./FindPendingCashbacksUseCase";
import { FindCashbackStatusUseCase } from "./FindCashbackStatusUseCase";
import { FindAllCashbacksUseCase } from "./FindAllCashbacksUseCase";
import { FindCashbackFiltersUseCase } from "./FindCashbackFiltersUseCase";
import { ValidateUserPasswordUseCase } from "./ValidateUserPasswordUseCase";
import { VerifyCashbacksExpired } from "./VerifyCashbacksExpired";
import { GetConsumerAutocompleteUseCase } from "./GetConsumerAutocompleteUseCase";
import { prisma } from "../../../prisma";
import { CashRegisterUseCase } from "../../../useCases/cashback/CashRegisterUseCase";
import { partition } from "../../../utils";

interface CancelProps {
  transactionIDs: number[];
  cancellationDescription: string;
}

class CashbackController {
  async validateUserPasswordToGenerateCashback(
    request: Request,
    response: Response
  ) {
    const { companyId, userId } = request["tokenPayload"];
    const { password } = request.body;

    const verify = new ValidateUserPasswordUseCase();

    const result = await verify.execute({ companyId, password, userId });

    return response.status(200).json(result);
  }

  async getConsumerAutoComplete(request: Request, response: Response) {
    const cpf = request.params.cpf;
    const { companyId } = request["tokenPayload"];

    const consumers = new GetConsumerAutocompleteUseCase();

    const result = await consumers.execute({ cpf, companyId });

    return response.status(200).json(result);
  }

  async getConsumerInfo(request: Request, response: Response) {
    const cpf = request.params.cpf;

    const consumerInfo = new GetConsumerInfoUseCase();

    const result = await consumerInfo.execute({ cpf });

    return response.status(200).json(result);
  }

  async findCashbackFilters(request: Request, response: Response) {
    const find = new FindCashbackFiltersUseCase();

    const status = await find.execute();

    return response.status(200).json(status);
  }

  async findPendingCashbacks(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCashbacks = new FindPendingCashbacksUseCase();

    const cashbacks = await findCashbacks.execute({ companyId });

    return response.status(200).json(cashbacks);
  }

  async findAllCashbacks(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const filters = request.query;
    const { offset, limit } = request.params;

    const findCashbacks = new FindAllCashbacksUseCase();
    const findStatus = new FindCashbackStatusUseCase();

    const cashbacks = await findCashbacks.execute({
      companyId,
      filters,
      offset,
      limit,
    });
    const status = await findStatus.execute();
    // const types = await findTypes.execute();

    return response.status(200).json({ cashbacks, status });
  }

  async cancelCashBack(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    let { cancellationDescription, transactionIDs: ids }: CancelProps =
      request.body;

    let [transactionIDs, monthlyPayment] = partition(
      ids,
      (t) => typeof t === "number"
    );

    const cancel = new CancelCashBackUseCase();

    const success = await cancel.execute({
      cancellationDescription,
      transactionIDs,
      companyId,
    });

    if (success) {
      const cashbacks = new FindPendingCashbacksUseCase();

      const result = await cashbacks.execute({ companyId });

      return response.status(200).json(result);
    }
  }

  async verifyCashbacksExpired(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const verify = new VerifyCashbacksExpired();

    const transactions = await verify.execute({ companyId });

    return response.status(200).json(transactions);
  }

  async listWaiting(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const waitingTransactionStatus = await prisma.transactionStatus.findFirst({
      where: { description: "Aguardando" },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        companiesId: companyId,
        transactionStatusId: waitingTransactionStatus.id,
        keyTransaction: null,
      },
      include: {
        transactionPaymentMethods: {
          select: {
            companyPaymentMethod: {
              select: { paymentMethod: { select: { description: true } } },
            },
          },
        },
        transactionStatus: true,
        consumer: true,
      },
    });

    return response.json(transactions);
  }

  async generateCashback(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const cashback = new CashRegisterUseCase();

    await cashback.execute({
      companyId,
      ...request.body,
    });

    return response.status(200).json("Cashback emitido");
  }
}

export { CashbackController };
