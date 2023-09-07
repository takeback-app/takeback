import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

interface Props {
  transactionIDs: number[]
  userId: string
}

class RecognizeSalesUseCase {
  async execute({ transactionIDs, userId }: Props) {
    if (!userId) {
      throw new InternalError('Campos incompletos', 400)
    }

    if (transactionIDs.length === 0) {
      throw new InternalError('Selecione uma venda', 400)
    }

    // Verifica se a transaction já foi reconhecida
    const transactions = await prisma.transaction.findMany({
      where: { id: { in: transactionIDs } },
    })

    const transactionsWithCompanyUsers = transactions.filter(
      (transaction) => transaction.companyUsersId !== null,
    )

    if (transactionsWithCompanyUsers.length > 0) {
      throw new InternalError('Cashback selecionado já está reconhecido', 400)
    }

    // Atualizando as transações
    await prisma.transaction.updateMany({
      where: { id: { in: transactionIDs } },
      data: {
        companyUsersId: userId,
        updatedAt: DateTime.now().toJSDate(),
      },
    })

    return 'Cashbacks reconhecidos com sucesso!'
  }
}

export { RecognizeSalesUseCase }
