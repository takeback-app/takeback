import bcrypt from 'bcrypt'
import { DateTime } from 'luxon'
import { InternalError } from '../../../config/GenerateErros'
import { prisma } from '../../../prisma'

interface TransferBalanceProps {
  consumerId: string
  consumerReceivedId: string
  value: number
  password: string
}

export class TransferBalanceUseCase {
  async execute(props: TransferBalanceProps) {
    if (
      !props.consumerReceivedId ||
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

    const consumerReceived = await prisma.consumer.findUnique({
      where: {
        id: props.consumerReceivedId,
      },
      select: {
        id: true,
        deactivatedAccount: true,
        balance: true,
      },
    })

    if (!consumerReceived) {
      throw new InternalError('Usuário não encontrado', 400)
    }

    if (consumerReceived.deactivatedAccount) {
      throw new InternalError('Usuário inativo', 400)
    }

    if (consumerReceived.id === props.consumerId) {
      throw new InternalError('Não é possível transferir para si mesmo', 400)
    }

    try {
      await prisma.$transaction(async (tx) => {
        const sentConsumerUpdate = await tx.consumer.update({
          where: { id: consumer.id },
          data: {
            balance: Number(consumer.balance) - props.value,
          },
        })

        if (!sentConsumerUpdate) {
          throw new InternalError('erro ao efetuar transferência', 400)
        }

        const receivedConsumerUpdate = await tx.consumer.update({
          where: { id: consumerReceived.id },
          data: {
            balance: Number(consumerReceived.balance) + props.value,
          },
        })

        if (!receivedConsumerUpdate) {
          throw new InternalError('erro ao efetuar transferência', 400)
        }

        const minuteAgo = DateTime.now().minus({ minutes: 1 }).toJSDate()

        const alreadyHasTransfer = await prisma.transfer.findMany({
          where: {
            consumerSentId: consumer.id,
            createdAt: {
              gte: minuteAgo,
            },
          },
        })

        if (alreadyHasTransfer.length) {
          throw new InternalError('Por favor, tente mais tarde', 400)
        }

        const newTransfer = await tx.transfer.create({
          data: {
            value: props.value,
            consumerReceivedId: consumerReceived.id,
            consumerSentId: consumer.id,
          },
        })

        if (!newTransfer) {
          throw new InternalError('erro ao efetuar transferência', 400)
        }

        return 'Sucesso'
      })
    } catch (err) {
      throw new InternalError(err, 400)
    }
  }
}
