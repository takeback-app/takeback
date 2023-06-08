import { Request, Response } from "express";
import { prisma } from "../../../prisma";
import { TransactionStatusEnum } from "../../../enum/TransactionStatusEnum";
import { FeeGraphUseCase } from "../../../useCases/graphs/FeeGraphUseCase";
import { BonusGraphUseCase } from "../../../useCases/graphs/BonusGraphUseCase";
import { ExpiredBalanceGraphUseCase } from "../../../useCases/graphs/ExpiredBalanceGraphUseCase";
import { ExpiredBalanceForecastGraphUseCase } from "../../../useCases/graphs/ExpiredBalanceForecastGraphUseCase";
import { CashbackGraphUseCase } from "../../../useCases/graphs/CashbackGraphUseCase";
import { CalculateCommissionAmountPendingUseCase } from "../../../useCases/manager/CalculateCommissionAmountPendingUseCase";

export class DashboardController {
  async totalizer(_request: Request, response: Response) {
    const consumers = await prisma.consumer.aggregate({
      _sum: { balance: true },
      _count: true,
    });

    const representatives = await prisma.representative.aggregate({
      _sum: { balance: true },
      _count: true,
    });

    const companies = await prisma.company.aggregate({
      _sum: { positiveBalance: true },
      _count: true,
    });

    const pendingCashbacks = await prisma.transaction.aggregate({
      _sum: {
        cashbackAmount: true,
        takebackFeeAmount: true,
      },
      where: {
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.PROCESSING,
              TransactionStatusEnum.ON_DELAY,
            ],
          },
        },
      },
    });

    const useCase = new CalculateCommissionAmountPendingUseCase();

    const commissionAmountPending = await useCase.handle();

    return response.json({
      consumerBalance: +consumers._sum.balance,
      consumerCount: +consumers._count,
      companyBalance: +companies._sum.positiveBalance,
      commissionAmountPending,
      companyCount: +companies._count,
      representativeBalance: +representatives._sum.balance,
      representativeCount: +representatives._count,
      pendingCashbackAmount: +pendingCashbacks._sum.cashbackAmount,
      pendingFeeAmount: +pendingCashbacks._sum.takebackFeeAmount,
    });
  }

  async feeGraph(_request: Request, response: Response) {
    const useCase = new FeeGraphUseCase();

    const data = await useCase.execute(6);

    return response.json(data);
  }

  async bonusGraph(_request: Request, response: Response) {
    const useCase = new BonusGraphUseCase();

    const data = await useCase.execute(6);

    return response.json(data);
  }

  async expireBalanceGraph(_request: Request, response: Response) {
    const useCase = new ExpiredBalanceGraphUseCase();

    const data = await useCase.execute(6);

    return response.json(data);
  }

  async expireBalanceForecastGraph(_request: Request, response: Response) {
    const useCase = new ExpiredBalanceForecastGraphUseCase();

    const data = await useCase.execute(-6);

    return response.json(data);
  }

  async cashbackGraph(_request: Request, response: Response) {
    const useCase = new CashbackGraphUseCase();

    const data = await useCase.execute(6);

    return response.json(data);
  }
}
