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
      where: { id: { in: transactionIDs } },
    })

    // Agrupando as transações por usuário
    const transactionsReduced = transactions.reduce(
      (previousValue, currentValue) => {
        previousValue[currentValue.consumersId] =
          previousValue[currentValue.consumersId] || []
        previousValue[currentValue.consumersId].push(currentValue)
        return previousValue
      },
      Object.create(null),
    )

    // Alterando o formato do agrupamento para um formato compatível para mapeamento
    const transactionGroupedPerConsumer = []

    for (const [key, values] of Object.entries(transactionsReduced)) {
      transactionGroupedPerConsumer.push({
        consumerId: key,
        transactions: values,
      })
    }

    const consumersAndValuesToAdjustBalances = []
    // Somando os valores das transações e agrupando por usuário

    for (const item of transactionGroupedPerConsumer) {
      let valueToSubtractBlockedBalance = 0
      let valueToAddInBalance = 0

      for (const transaction of item.transactions) {
        valueToSubtractBlockedBalance =
          valueToSubtractBlockedBalance +
          parseFloat(transaction.cashbackAmount) +
          parseFloat(transaction.backAmount)
        valueToAddInBalance =
          valueToAddInBalance +
          parseFloat(transaction.amountPayWithTakebackBalance)
      }

      consumersAndValuesToAdjustBalances.push({
        consumerId: item.consumerId,
        valueToSubtractBlockedBalance,
        valueToAddInBalance,
      })
    }

    const cancelUseCase = new CancelTransactionUseCase()

    // Percorrendo cada uma das transações localizadas
    for (const transaction of transactions) {
      await cancelUseCase.execute({
        transactionId: transaction.id,
        cancellationDescription,
      })
    }

    // Mapeando os usuários agrupados nas transações
    let valueToSubtractCompanyPositiveBalance = 0

    for (const item of consumersAndValuesToAdjustBalances) {
      valueToSubtractCompanyPositiveBalance =
        valueToSubtractCompanyPositiveBalance + item.valueToAddInBalance

      const balanceOfConsumer = await prisma.consumer.findFirst({
        where: { id: item.consumerId },
      })

      await prisma.consumer.update({
        where: { id: item.consumerId },
        data: {
          blockedBalance:
            +balanceOfConsumer.blockedBalance -
            item.valueToSubtractBlockedBalance,
          balance: +balanceOfConsumer.balance + item.valueToAddInBalance,
        },
      })
    }

    // Buscando a empresa para pegar o saldo da mesma
    const companyBalance = await prisma.company.findFirst({
      where: { id: companyId },
    })

    // Somando o valor total a ser descontado do saldo negativo da empresa
    let valueToUpdateCompanyBalance = 0

    for (const item of transactions) {
      valueToUpdateCompanyBalance +=
        +item.takebackFeeAmount + +item.cashbackAmount + +item.backAmount
    }

    // Atualizando o saldo negativo da empresa
    await prisma.company.update({
      where: { id: companyId },
      data: {
        negativeBalance:
          +companyBalance.negativeBalance - valueToUpdateCompanyBalance,
        positiveBalance:
          +companyBalance.positiveBalance -
          valueToSubtractCompanyPositiveBalance,
      },
    })

    await new UpdateCompanyStatusByTransactionsUseCase().execute(companyId)

    return true
  }
}

export { CancelCashBackUseCase }
