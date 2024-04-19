import { UpdateCompanyStatusByTransactionsUseCase } from './UpdateCompanyStatusByTransactionsUseCase'
import { InternalError } from '../../../config/GenerateErros'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'
import { prisma } from '../../../prisma'
import { CancelTransactionUseCase } from '../../../useCases/cashback/CancelTransactionUseCase'

interface CancelProps {
  transactionIDs: number[]
  cancellationDescription: string
  companyId: string
}

class CancelCashBackUseCase {
  async execute({
    cancellationDescription,
    transactionIDs,
    companyId,
  }: CancelProps) {
    // Verificando se os dados necessários foram informados
    if (!cancellationDescription || transactionIDs.length === 0) {
      throw new InternalError('Campos incompletos', 400)
    }

    // Buscando o status de cancelada pelo parceiro para atualizar a transação
    const status = await prisma.transactionStatus.findFirst({
      where: { description: TransactionStatusEnum.CANCELED_BY_PARTNER },
    })

    // Verificando se o status foi localizado
    if (!status) {
      throw new InternalError('Erro ao cancelar transação', 400)
    }

    // Buscando todas as transações informadas pelo usuário
    const transactions = await prisma.transaction.findMany({
      where: {
        id: { in: transactionIDs },
        transactionStatus: {
          description: {
            in: [
              TransactionStatusEnum.PENDING,
              TransactionStatusEnum.ON_DELAY,
              TransactionStatusEnum.PROCESSING,
            ],
          },
        },
      },
    })

    const cancelUseCase = new CancelTransactionUseCase()

    let valueToSubtractCompanyNegativeBalance = 0
    let valueToSubtractCompanyPositiveBalance = 0

    // Percorrendo cada uma das transações localizadas
    for (const transaction of transactions) {
      await cancelUseCase.execute({
        transactionId: transaction.id,
        cancellationDescription,
      })

      await prisma.consumer.update({
        where: { id: transaction.consumersId },
        data: {
          blockedBalance: {
            decrement: transaction.cashbackAmount.plus(transaction.backAmount),
          },
          balance: { increment: transaction.amountPayWithTakebackBalance },
        },
      })

      valueToSubtractCompanyNegativeBalance += transaction.takebackFeeAmount
        .add(transaction.cashbackAmount)
        .add(transaction.backAmount)
        .toNumber()

      valueToSubtractCompanyPositiveBalance +=
        transaction.amountPayWithTakebackBalance.toNumber()
    }

    // Atualizando o saldo negativo da empresa
    await prisma.company.update({
      where: { id: companyId },
      data: {
        negativeBalance: { decrement: valueToSubtractCompanyNegativeBalance },
        positiveBalance: { decrement: valueToSubtractCompanyPositiveBalance },
      },
    })

    await new UpdateCompanyStatusByTransactionsUseCase().execute(companyId)

    return true
  }
}

export { CancelCashBackUseCase }
