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
      include: {
        consumer: { select: { balance: true, blockedBalance: true } },
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
          blockedBalance: transaction.consumer.blockedBalance
            .sub(transaction.cashbackAmount)
            .sub(transaction.backAmount),
          balance: transaction.consumer.balance.add(
            transaction.amountPayWithTakebackBalance,
          ),
        },
      })

      valueToSubtractCompanyNegativeBalance += transaction.takebackFeeAmount
        .add(transaction.cashbackAmount)
        .add(transaction.backAmount)
        .toNumber()

      valueToSubtractCompanyPositiveBalance +=
        transaction.amountPayWithTakebackBalance.toNumber()
    }

    const company = await prisma.company.findFirst({
      where: { id: companyId },
      select: { negativeBalance: true, positiveBalance: true },
    })

    // Atualizando o saldo negativo da empresa
    await prisma.company.update({
      where: { id: companyId },
      data: {
        negativeBalance: company.negativeBalance.sub(
          valueToSubtractCompanyNegativeBalance,
        ),
        positiveBalance: company.positiveBalance.sub(
          valueToSubtractCompanyPositiveBalance,
        ),
      },
    })

    await new UpdateCompanyStatusByTransactionsUseCase().execute(companyId)

    return true
  }
}

export { CancelCashBackUseCase }
