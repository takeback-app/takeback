import bcrypt from 'bcrypt'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

interface TransferBalanceProps {
  consumerId: string
  sentConsumerId: string
  value: number
  password: string
}

export class TransferBalanceUseCase {
  async execute(props: TransferBalanceProps) {
    if (
      !props.sentConsumerId ||
      !props.consumerId ||
      !props.password ||
      !props.value ||
      props.value <= 0 ||
      typeof props.value !== 'number'
    ) {
      throw new InternalError('Dados incompletos', 400)
    }

    const consumer = await prisma.consumer.findUnique({
      where: {
        id: props.consumerId,
      },
      select: {
        id: true,
        balance: true,
        password: true,
      },
    })

    if (Number(consumer.balance) < props.value) {
      throw new InternalError('Saldo insuficiente', 400)
    }

    const passwordMatch = await bcrypt.compare(
      props.password,
      consumer.password,
    )

    if (!passwordMatch) {
      throw new InternalError('Erro ao confirmar transferência', 400)
    }

    const consumerTransfer = await prisma.consumer.findUnique({
      where: {
        id: props.sentConsumerId,
      },
      select: {
        id: true,
        deactivatedAccount: true,
        balance: true,
      },
    })

    if (!consumerTransfer) {
      throw new InternalError('Usuário não encontrado', 400)
    }

    if (consumerTransfer.deactivatedAccount) {
      throw new InternalError('Usuário inativo', 400)
    }

    if (consumerTransfer.id === props.consumerId) {
      throw new InternalError('Não é possível transferir para si mesmo', 400)
    }

    const newTransfer = await prisma.transfer.create({
      data: {
        value: props.value,
        consumerReceivedId: consumerTransfer.id,
        consumerSentId: consumer.id,
      },
    })

    if (!newTransfer) {
      throw new InternalError('erro ao efetuar transferência', 400)
    }

    const sentConsumerUpdate = await prisma.consumer.update({
      where: { id: consumer.id },
      data: {
        balance: Number(consumer.balance) - props.value,
      },
    })

    if (!sentConsumerUpdate) {
      throw new InternalError('erro ao efetuar transferência', 400)
    }

    const receivedConsumerUpdate = await prisma.consumer.update({
      where: { id: consumerTransfer.id },
      data: {
        balance: Number(consumerTransfer.balance) + props.value,
      },
    })

    if (!receivedConsumerUpdate) {
      throw new InternalError('erro ao efetuar transferência', 400)
    }

    return 'Sucesso'
  }
}
