import { Decimal } from '@prisma/client/runtime'
import { prisma } from '../../prisma'
import { TransactionStatusEnum } from '../../enum/TransactionStatusEnum'
import { InternalError } from '../../config/GenerateErros'

export class ChargebackUseCase {
  async handle(transactionId: number) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        transactionStatus: {
          description: TransactionStatusEnum.PAID_WITH_TAKEBACK,
        },
      },
      select: {
        amountPayWithOthersMethods: true,
        amountPayWithTakebackBalance: true,
        company: { select: { id: true, positiveBalance: true } },
        consumer: { select: { id: true, balance: true } },
      },
    })

    if (!transaction) {
      throw new InternalError('Transação não encontrada', 404)
    }

    if (transaction.amountPayWithOthersMethods.greaterThan(0)) {
      throw new InternalError(
        'Não é possível estornar uma transação que possui saldo em outros métodos de pagamento',
        403,
      )
    }

    if (
      transaction.company.positiveBalance.lessThan(
        transaction.amountPayWithTakebackBalance,
      )
    ) {
      throw new InternalError(
        'Saldo insuficiente para estornar a transação',
        403,
      )
    }

    await this.updateCompanyBalance(transaction.company, transaction)
    await this.updateConsumerBalance(transaction.consumer, transaction)

    const status = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.CANCELED_BY_PARTNER },
    })

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        transactionStatusId: status.id,
        cancellationDescription: 'Estorno de transação',
      },
    })
  }

  updateConsumerBalance(
    consumer: { id: string; balance: Decimal },
    transaction: { amountPayWithTakebackBalance: Decimal },
  ) {
    return prisma.consumer.update({
      where: { id: consumer.id },
      data: {
        balance: consumer.balance.add(transaction.amountPayWithTakebackBalance),
      },
    })
  }

  updateCompanyBalance(
    company: { id: string; positiveBalance: Decimal },
    transaction: { amountPayWithTakebackBalance: Decimal },
  ) {
    return prisma.company.update({
      where: { id: company.id },
      data: {
        positiveBalance: company.positiveBalance.sub(
          transaction.amountPayWithTakebackBalance,
        ),
      },
    })
  }
}
