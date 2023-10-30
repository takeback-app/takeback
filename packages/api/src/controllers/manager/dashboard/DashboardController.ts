import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { prisma } from '../../../prisma'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { FeeGraphUseCase } from '../../../useCases/graphs/FeeGraphUseCase'
import { BonusGraphUseCase } from '../../../useCases/graphs/BonusGraphUseCase'
import { ExpiredBalanceGraphUseCase } from '../../../useCases/graphs/ExpiredBalanceGraphUseCase'
import { ExpiredBalanceForecastGraphUseCase } from '../../../useCases/graphs/ExpiredBalanceForecastGraphUseCase'
import { CashbackGraphUseCase } from '../../../useCases/graphs/CashbackGraphUseCase'
import { CalculateCommissionAmountPendingUseCase } from '../../../useCases/manager/CalculateCommissionAmountPendingUseCase'
import { StoreCreditGraphUseCase } from '../../../useCases/graphs/StoreCreditGraphUseCase'
import { StoreValueGraphUseCase } from '../../../useCases/graphs/StoreValueGraphUseCase'
import { ConsumerMonthlyGraphUseCase } from '../../../useCases/graphs/ConsumerMonthlyGraphUseCase'
import { ConsumerDailyGraphUseCase } from '../../../useCases/graphs/ConsumerDailyGraphUseCase'

export class DashboardController {
  async totalizer(_request: Request, response: Response) {
    const currentDate = DateTime.now().toJSDate()
    const twoMonthsAgo = DateTime.now().minus({ months: 2 }).toJSDate()

    const consumers = await prisma.consumer.aggregate({
      _sum: { balance: true },
      _count: true,
    })

    // são os que fizeram cadastro, fizeram alguma movimentação (transação ou oferta), mas que há mais de 2 meses não movimentaram mais
    const inactiveConsumers = await prisma.consumer.count({
      where: {
        isPlaceholderConsumer: false,
        OR: [
          {
            transactions: {
              some: {
                createdAt: {
                  lt: twoMonthsAgo,
                },
              },
            },
          },
          {
            storeOrders: {
              some: {
                createdAt: {
                  lt: twoMonthsAgo,
                },
              },
            },
          },
        ],
      },
    })

    // são os que fizeram cadastro, fizeram alguma movimentação (transação ou oferta) nos últimos 2 meses
    const activeConsumers = await prisma.consumer.count({
      where: {
        isPlaceholderConsumer: false,
        OR: [
          {
            transactions: {
              some: {
                createdAt: {
                  gte: twoMonthsAgo,
                },
              },
            },
          },
          {
            storeOrders: {
              some: {
                createdAt: {
                  gte: twoMonthsAgo,
                },
              },
            },
          },
        ],
      },
    })

    // são aqueles que baixaram o app, fizeram o cadastro mas que nos últimos 2 meses ainda não movimentaram
    const newUsers = await prisma.consumer.count({
      where: {
        isPlaceholderConsumer: false,
        createdAt: {
          gte: twoMonthsAgo,
        },
        OR: [
          {
            NOT: {
              transactions: {
                some: {
                  createdAt: {
                    lte: currentDate,
                  },
                },
              },
            },
          },
          {
            NOT: {
              storeOrders: {
                some: {
                  createdAt: {
                    lte: currentDate,
                  },
                },
              },
            },
          },
        ],
      },
    })

    // são aqueles que baixaram o app, fizeram o cadastro mas que a mais de 2 meses ainda não movimentaram
    const inactiveUsers = await prisma.consumer.count({
      where: {
        isPlaceholderConsumer: false,
        createdAt: {
          lt: twoMonthsAgo,
        },
        OR: [
          {
            NOT: {
              transactions: {
                some: {
                  createdAt: {
                    lte: currentDate,
                  },
                },
              },
            },
          },
          {
            NOT: {
              storeOrders: {
                some: {
                  createdAt: {
                    lte: currentDate,
                  },
                },
              },
            },
          },
        ],
      },
    })

    // somente usuários placeholder
    const placeholderUsers = await prisma.consumer.count({
      where: {
        isPlaceholderConsumer: true,
      },
    })

    const representatives = await prisma.representative.aggregate({
      _sum: { balance: true },
      _count: true,
    })

    const companies = await prisma.company.aggregate({
      _sum: { positiveBalance: true },
      _count: true,
    })

    const activeCompanies = await prisma.company.count({
      where: {
        statusId: 1,
      },
    })

    const overdueCompanies = await prisma.company.count({
      where: {
        statusId: { in: [7, 8] },
      },
    })

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
    })

    const useCase = new CalculateCommissionAmountPendingUseCase()

    const commissionAmountPending = await useCase.handle()

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
      activeConsumers,
      inactiveConsumers,
      newUsers,
      inactiveUsers,
      placeholderUsers,
      activeCompanies,
      overdueCompanies,
    })
  }

  async feeGraph(_request: Request, response: Response) {
    const useCase = new FeeGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async bonusGraph(_request: Request, response: Response) {
    const useCase = new BonusGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async expireBalanceGraph(_request: Request, response: Response) {
    const useCase = new ExpiredBalanceGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async expireBalanceForecastGraph(_request: Request, response: Response) {
    const useCase = new ExpiredBalanceForecastGraphUseCase()

    const data = await useCase.execute(-6)

    return response.json(data)
  }

  async cashbackGraph(_request: Request, response: Response) {
    const useCase = new CashbackGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async storeValue(_request: Request, response: Response) {
    const useCase = new StoreValueGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async storeCredit(_request: Request, response: Response) {
    const useCase = new StoreCreditGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async consumerMonthlyGraph(_request: Request, response: Response) {
    const useCase = new ConsumerMonthlyGraphUseCase()

    const data = await useCase.execute(6)

    return response.json(data)
  }

  async consumerDailyGraph(_request: Request, response: Response) {
    const useCase = new ConsumerDailyGraphUseCase()

    const data = await useCase.execute(30)

    return response.json(data)
  }
}
