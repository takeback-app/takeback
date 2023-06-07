import { Request, Response } from "express";
import { FindPendingCashbacksUseCase } from "../companyCashback/FindPendingCashbacksUseCase";
import { FindCompanyDataUseCase } from "../companyData/FindCompanyDataUseCase";
import { CancelPaymentOrderUseCase } from "./CancelPaymentOrderUseCase";
import { FindaPaymentMethodUseCase } from "./FindPaymentMethodUseCase";
import { GeneratePaymentOrderUseCase } from "./GeneratePaymentOrderUseCase";
import { GeneratePaymentOrderWithTakebackBalanceUseCase } from "./GeneratePaymentOrderWithTakebackBalanceUseCase";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";
import { FindTransactionsInPaymentOrderUseCase } from "./FindTransactionsInPaymentOrderUseCase";
import { partition } from "../../../utils";
import { MonthlyPaymentUseCase } from "../../../useCases/company/MonthlyPaymentUseCase";

interface Props {
  transactionIDs: number[];
  paymentMethodId: number;
}

interface FindOrdersQueryProps {
  statusId?: string;
}

class PaymentOrderController {
  async generate(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    let { transactionIDs: ids, paymentMethodId }: Props = request.body;

    let [transactionIDs, monthlyPayment] = partition(
      ids,
      (t) => typeof t === "number"
    );

    const monthlyPaymentUseCase = new MonthlyPaymentUseCase();

    if (paymentMethodId === 1) {
      const generatePaymentOrderWithTakebackBalance =
        new GeneratePaymentOrderWithTakebackBalanceUseCase();

      const finData = new FindCompanyDataUseCase();
      const findCashbacks = new FindPendingCashbacksUseCase();

      const message = transactionIDs.length
        ? await generatePaymentOrderWithTakebackBalance.execute({
            transactionIDs,
            companyId,
            paymentMethodId,
          })
        : "Cashbacks liberados 🤑";

      if (monthlyPayment.length) {
        await monthlyPaymentUseCase.payManyWithTakeback(
          monthlyPayment.map((m) => Number(m.replace(/\D/g, ""))) // remove all non numeric characters
        );
      }

      const companyData = await finData.execute({
        companyId,
      });

      const transactions = await findCashbacks.execute({
        companyId,
      });

      return response.status(200).json({ message, companyData, transactions });
    } else {
      const generatePaymentOrder = new GeneratePaymentOrderUseCase();

      const finData = new FindCompanyDataUseCase();
      const findCashbacks = new FindPendingCashbacksUseCase();

      const message = transactionIDs.length
        ? await generatePaymentOrder.execute({
            transactionIDs,
            companyId,
            paymentMethodId,
          })
        : "Estamos processando o pagamento, isso pode levar algumas horas.";

      if (monthlyPayment.length) {
        await monthlyPaymentUseCase.payMany(
          monthlyPayment.map((m) => Number(m.replace(/\D/g, ""))) // remove all non numeric characters
        );
      }

      const companyData = await finData.execute({
        companyId,
      });

      const transactions = await findCashbacks.execute({ companyId });

      return response.status(200).json({ message, companyData, transactions });
    }
  }

  async cancel(request: Request, response: Response) {
    const orderId = request.params.id;

    const cancelOrder = new CancelPaymentOrderUseCase();

    const result = await cancelOrder.execute({
      orderId: parseInt(orderId),
    });

    return response.status(200).json(result);
  }

  async findPaymentMethod(request: Request, response: Response) {
    const find = new FindaPaymentMethodUseCase();

    const result = await find.execute();

    return response.status(200).json(result);
  }

  async findOrders(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { offset, limit } = request.params;
    const filters: FindOrdersQueryProps = request.query;

    const findUseCase = new FindPaymentOrderUseCase();

    const orders = await findUseCase.execute({
      companyId,
      pagination: { limit, offset },
      filters,
    });

    response.status(200).json(orders);
  }

  async findTransactionsInPaymentOrder(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const paymentOrderId = request.params.id;

    const find = new FindTransactionsInPaymentOrderUseCase();

    const transactions = await find.execute({
      companyId,
      paymentOrderId: parseInt(paymentOrderId),
    });

    return response.status(200).json(transactions);
  }
}

export { PaymentOrderController };
