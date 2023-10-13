import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'
import { PaymentOrderStatusEnum } from '../../../enum/PaymentOrderStatusEnum'
import { TransactionStatusEnum } from '../../../enum/TransactionStatusEnum'

interface Props {
  orderId: number
}

class CancelPaymentOrderUseCase {
  async execute({ orderId }: Props) {
    // Verificando se os dados estão completos
    if (!orderId) {
      throw new InternalError('Campos incompletos', 400)
    }

    // Buscando a ordem de pagamento e as transações relacionadas
    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { id: orderId },
      include: {
        transactions: true,
        paymentOrderStatus: true,
      },
    })

    if (!paymentOrder) {
      throw new InternalError('Erro ao encontrar ordem de pagamento', 404)
    }

    if (
      paymentOrder.paymentOrderStatus.description ===
      PaymentOrderStatusEnum.AUTHORIZED
    ) {
      throw new InternalError(
        'Não foi possível cancelar pois a ordem de pagamento já foi autorizada',
        400,
      )
    }

    // BUSCANDO OS STATUS A SEREM ATUALIZADOS
    // Status Pendente para transações pendentes
    /*  const transactionPendingStatus = await getRepository(
      TransactionStatus,
    ).findOne({
      where: { description: 'Pendente' },
    })
 */
    const transactionPendingStatus = await prisma.transactionStatus.findFirst({
      where: {
        description: TransactionStatusEnum.PENDING,
      },
    })
    // Status Em atraso para transações com mais de dez dias de atraso
    const transactionExpiredStatus = await prisma.transactionStatus.findFirst({
      where: {
        description: TransactionStatusEnum.ON_DELAY,
      },
    })

    // Status para a ordem de pagamento
    const orderCanceledStatus = await prisma.paymentOrderStatus.findFirst({
      where: {
        description: PaymentOrderStatusEnum.CANCELED,
      },
    })

    // Verificando se todos os status foram encontrados
    if (
      !transactionPendingStatus ||
      !transactionExpiredStatus ||
      !orderCanceledStatus
    ) {
      throw new InternalError('Erro ao cancelar', 400)
    }

    // ATUALIZANDO O STATUS DAS TRANSAÇÕES

    for (const transaction of paymentOrder.transactions) {
      const transactionCreatedAt = DateTime.fromJSDate(transaction.createdAt)
      const today = DateTime.now()
      const diff = today.diff(transactionCreatedAt, 'days').as('days')
      const tansactionStatus =
        diff >= 10 ? transactionExpiredStatus : transactionPendingStatus

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { transactionStatusId: tansactionStatus.id },
      })
    }

    // Atualizando o status da ordem de pagamento
    await prisma.paymentOrder.update({
      where: {
        id: paymentOrder.id,
      },
      data: {
        statusId: orderCanceledStatus.id,
      },
    })

    return 'Sucesso'
  }
}

export { CancelPaymentOrderUseCase }
