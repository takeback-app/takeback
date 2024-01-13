import {
  Company,
  Consumer,
  Transaction,
  TransactionSource,
} from '@prisma/client'
import { InternalError } from '../../config/GenerateErros'
import { NewCashback, Notify, PaymentApproved } from '../../notifications'
import { prisma } from '../../prisma'
import { GenerateUserCacheUseCase } from '../consumer/GenerateUserCacheUseCase'
import { UpdateBalanceExpireDate } from '../consumer/UpdateBalanceExpireDate'
import { GenerateTicketFromTransactionUseCase } from '../raffle/GenerateTicketFromTransactionUseCase'
import { TransactionGenerator } from './TransactionGenerator'

interface PaymentMethod {
  id: number
  value: number
}

interface GenerateCashbackUseDTO {
  companyId: string
  consumerId: string
  companyUserId?: string
  totalAmount: number
  backAmount?: number
  createdAt?: Date
  paymentMethods: PaymentMethod[]
  transactionSource: TransactionSource
}

export class GenerateCashbackUseCase {
  private generateUserCache: GenerateUserCacheUseCase
  private generateTicketFromTransaction: GenerateTicketFromTransactionUseCase
  private updateBalanceExpireDate: UpdateBalanceExpireDate

  constructor() {
    this.generateUserCache = new GenerateUserCacheUseCase()
    this.generateTicketFromTransaction =
      new GenerateTicketFromTransactionUseCase()
    this.updateBalanceExpireDate = new UpdateBalanceExpireDate()
  }

  async execute(data: GenerateCashbackUseDTO) {
    const {
      backAmount = 0,
      paymentMethods,
      totalAmount,
      companyId,
      companyUserId,
      consumerId,
      transactionSource,
    } = data

    const sumMethodValue = Number(
      paymentMethods.reduce((sum, { value }) => sum + value, 0).toFixed(2)
    )

    if (sumMethodValue !== Number(totalAmount) + backAmount) {
      throw new InternalError('A soma dos items está incorreta', 400)
    }

    const { company, consumer, ...status } = await this.getInitialEntities(
      companyId,
      consumerId,
      companyUserId
    )

    if (!company.useCashbackAsBack && backAmount) {
      throw new InternalError(
        'Opção de troco como cashback não disponível',
        400
      )
    }

    const companyPaymentMethods = await prisma.companyPaymentMethod.findMany({
      where: {
        id: { in: paymentMethods.map(({ id }) => id) },
        isActive: true,
      },
      include: {
        paymentMethod: true,
      },
    })

    if (companyPaymentMethods.length !== paymentMethods.length) {
      throw new InternalError('Há itens duplicados', 400)
    }

    const transactionGenerator = new TransactionGenerator(companyPaymentMethods)

    const transactionData = transactionGenerator
      .calculateCashback(paymentMethods, backAmount)
      .calculateFee(company)
      .getData()

    const { pendingTransactionStatus, takebackTransactionStatus } = status

    const hasOnlyTakebackPaymentMethod =
      transactionGenerator.hasTakebackPaymentMethod() &&
      companyPaymentMethods.length === 1

    if (transactionData.cashbackAmount === 0 && !hasOnlyTakebackPaymentMethod) {
      return null
    }

    const transactionStatusId = hasOnlyTakebackPaymentMethod
      ? takebackTransactionStatus.id
      : pendingTransactionStatus.id

    const transaction = await prisma.transaction.create({
      data: {
        ...transactionData,
        totalAmount,
        consumersId: consumer.id,
        companiesId: company.id,
        companyUsersId: companyUserId,
        dateAt: new Date(),
        createdAt: data.createdAt,
        backAmount,
        transactionStatusId,
        transactionSource,
      },
    })

    const transactionPaymentMethods =
      transactionGenerator.getTransactionPaymentMethodsData()

    for (const transactionPaymentMethod of transactionPaymentMethods) {
      await prisma.transactionPaymentMethod.create({
        data: {
          ...transactionPaymentMethod,
          transactionsId: transaction.id,
        },
      })
    }

    await this.updateConsumerBalance(consumer, transaction)

    await this.updateCompanyBalance(company, transaction)

    await this.updateBalanceExpireDate.execute(consumer.id)

    await this.generateUserCache.execute(consumer, companyId)

    await this.generateTicketFromTransaction.execute(transaction)

    const Notification = hasOnlyTakebackPaymentMethod
      ? PaymentApproved
      : NewCashback

    await Notify.send(
      consumerId,
      new Notification(transaction, company.fantasyName)
    )

    return transaction
  }

  private async getInitialEntities(
    companyId: string,
    consumerId: string,
    companyUserId?: string
  ) {
    const companyUser = await prisma.companyUser.findFirst({
      where: { id: companyUserId },
    })

    const consumer = await prisma.consumer.findFirst({
      where: { id: consumerId },
    })

    if (consumer.deactivatedAccount) {
      throw new InternalError('O cliente não está ativo', 400)
    }

    if (consumer.cpf === companyUser?.cpf) {
      throw new InternalError(
        'Não é possível lançar cashback para si mesmo',
        400
      )
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        industry: {
          select: {
            industryFee: true,
          },
        },
      },
    })

    const pendingTransactionStatus = await prisma.transactionStatus.findFirst({
      where: {
        description: 'Pendente',
      },
    })

    const takebackTransactionStatus = await prisma.transactionStatus.findFirst({
      where: {
        description: 'Pago com takeback',
      },
    })

    return {
      pendingTransactionStatus,
      takebackTransactionStatus,
      company,
      consumer,
    }
  }

  updateConsumerBalance(consumer: Consumer, transaction: Transaction) {
    return prisma.consumer.update({
      where: { id: consumer.id },
      data: {
        blockedBalance: {
          increment: transaction.cashbackAmount.plus(transaction.backAmount),
        },
        balance: { decrement: transaction.amountPayWithTakebackBalance },
      },
    })
  }

  updateCompanyBalance(company: Company, transaction: Transaction) {
    return prisma.company.update({
      where: { id: company.id },
      data: {
        positiveBalance: {
          increment: transaction.amountPayWithTakebackBalance,
        },
        negativeBalance: {
          increment: transaction.cashbackAmount
            .plus(transaction.takebackFeeAmount)
            .plus(transaction.backAmount),
        },
      },
    })
  }
}
